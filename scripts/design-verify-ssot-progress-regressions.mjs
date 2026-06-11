#!/usr/bin/env node

import fs from "node:fs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

function parseList(rawValue) {
  const values = [];
  for (const item of String(rawValue).split(",")) {
    const trimmed = item.trim();
    if (trimmed.length > 0) values.push(trimmed);
  }
  return values;
}

function parseCliArgs(rawArgs) {
  let inputPath = null;
  let categoryThresholdsPath = null;
  let reportJsonPath = null;
  const allowedMetricKeys = new Set();

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];

    if (arg.startsWith("--input=")) {
      inputPath = arg.slice("--input=".length);
      continue;
    }
    if (arg.startsWith("--category-thresholds=")) {
      categoryThresholdsPath = arg.slice("--category-thresholds=".length);
      continue;
    }
    if (arg.startsWith("--report-json=")) {
      reportJsonPath = arg.slice("--report-json=".length);
      continue;
    }
    if (arg === "--input") {
      const value = rawArgs[index + 1];
      if (typeof value === "string" && !value.startsWith("--")) {
        inputPath = value;
        index += 1;
      }
      continue;
    }
    if (arg === "--category-thresholds") {
      const value = rawArgs[index + 1];
      if (typeof value !== "string" || value.startsWith("--")) {
        throw new Error("design:verify: --category-thresholds requires a JSON file path");
      }
      categoryThresholdsPath = value;
      index += 1;
      continue;
    }
    if (arg === "--report-json") {
      const value = rawArgs[index + 1];
      if (typeof value !== "string" || value.startsWith("--")) {
        throw new Error("design:verify: --report-json requires a JSON file path");
      }
      reportJsonPath = value;
      index += 1;
      continue;
    }

    if (arg.startsWith("--allow-metrics=")) {
      for (const key of parseList(arg.slice("--allow-metrics=".length))) {
        allowedMetricKeys.add(key);
      }
      continue;
    }
    if (arg === "--allow-metrics") {
      const value = rawArgs[index + 1];
      if (typeof value !== "string" || value.startsWith("--")) {
        throw new Error("design:verify: --allow-metrics requires a comma-separated value");
      }
      for (const key of parseList(value)) {
        allowedMetricKeys.add(key);
      }
      index += 1;
      continue;
    }
  }

  if (!inputPath) {
    throw new Error("design:verify: ssot progress regressions requires --input=<json-path>");
  }

  return { inputPath, allowedMetricKeys, categoryThresholdsPath, reportJsonPath };
}

function collectMetricRegressions(diffReport, allowedMetricKeys) {
  const metrics = Array.isArray(diffReport?.metrics) ? diffReport.metrics : [];
  return metrics.filter(
    (metric) => metric?.trend === "regressed" && !allowedMetricKeys.has(String(metric?.key ?? ""))
  );
}

function parseThresholdMap(rawValue) {
  if (!rawValue || typeof rawValue !== "object" || Array.isArray(rawValue)) return {};
  const result = {};
  for (const [key, value] of Object.entries(rawValue)) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
      throw new Error(
        `design:verify: invalid category threshold for "${key}": expected non-negative number`
      );
    }
    result[key] = numeric;
  }
  return result;
}

function resolveCategoryThresholdConfig(categoryThresholds) {
  return {
    stubsUnresolved: parseThresholdMap(categoryThresholds?.stubsUnresolved),
    docsUnresolved: parseThresholdMap(categoryThresholds?.docsUnresolved),
    styleDrift: parseThresholdMap(categoryThresholds?.styleDrift),
  };
}

function getAllowedDelta(thresholdMap, category) {
  if (typeof thresholdMap?.[category] === "number") return thresholdMap[category];
  if (typeof thresholdMap?.["*"] === "number") return thresholdMap["*"];
  return 0;
}

function collectCategoryRegressions(diffReport, categoryThresholds) {
  const thresholdConfig = resolveCategoryThresholdConfig(categoryThresholds);
  const sections = [
    { key: "stubsUnresolved", label: "stubs unresolved", thresholds: thresholdConfig.stubsUnresolved },
    { key: "docsUnresolved", label: "docs unresolved", thresholds: thresholdConfig.docsUnresolved },
    { key: "styleDrift", label: "style drift", thresholds: thresholdConfig.styleDrift },
  ];

  const regressions = [];
  for (const section of sections) {
    const categoryDiff = diffReport?.byCategory?.[section.key] ?? {};
    for (const [category, entry] of Object.entries(categoryDiff)) {
      const delta = Number(entry?.delta ?? 0);
      const allowedDelta = getAllowedDelta(section.thresholds, category);
      if (Number.isFinite(delta) && delta > allowedDelta) {
        regressions.push({
          section: section.label,
          category,
          delta,
          allowedDelta,
          base: Number(entry?.base ?? 0),
          head: Number(entry?.head ?? 0),
        });
      }
    }
  }
  return regressions;
}

function buildRegressionReport({ diffReport, allowedMetricKeys, categoryThresholdsPath, categoryThresholds }) {
  const metricRegressions = collectMetricRegressions(diffReport, allowedMetricKeys);
  const categoryRegressions = collectCategoryRegressions(diffReport, categoryThresholds);
  return {
    passed: metricRegressions.length === 0 && categoryRegressions.length === 0,
    metricRegressionCount: metricRegressions.length,
    categoryRegressionCount: categoryRegressions.length,
    metricRegressions,
    categoryRegressions,
    allowedMetricKeys: [...allowedMetricKeys].sort((a, b) => a.localeCompare(b)),
    categoryThresholdsPath: categoryThresholdsPath ?? null,
  };
}

function writeRegressionReportJson(path, report) {
  fs.writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

function verifyRegressions({ diffReport, allowedMetricKeys, categoryThresholdsPath, categoryThresholds, reportJsonPath }) {
  const report = buildRegressionReport({
    diffReport,
    allowedMetricKeys,
    categoryThresholdsPath,
    categoryThresholds,
  });

  if (reportJsonPath) {
    writeRegressionReportJson(reportJsonPath, report);
  }

  if (report.passed) {
    console.log("design:verify: ssot progress regression gate passed");
    return;
  }

  const lines = ["design:verify: ssot progress regression gate failed.", "Regressions:"];
  for (const metric of report.metricRegressions) {
    lines.push(
      `- metric ${metric.key}: ${metric.label} (base=${metric.base}, head=${metric.head}, delta=${metric.delta})`
    );
  }
  for (const regression of report.categoryRegressions) {
    lines.push(
      `- category ${regression.section}/${regression.category}: base=${regression.base}, head=${regression.head}, delta=+${regression.delta} (allowed: +${regression.allowedDelta})`
    );
  }
  if (report.allowedMetricKeys.length > 0) {
    lines.push(`Allowed metric keys: ${report.allowedMetricKeys.join(", ")}`);
  }
  throwLinesError(lines);
}

function runRegressionGateCli() {
  const { inputPath, allowedMetricKeys, categoryThresholdsPath, reportJsonPath } = parseCliArgs(
    process.argv.slice(2)
  );
  const diffReport = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const categoryThresholds = categoryThresholdsPath
    ? JSON.parse(fs.readFileSync(categoryThresholdsPath, "utf8"))
    : null;
  verifyRegressions({
    diffReport,
    allowedMetricKeys,
    categoryThresholdsPath,
    categoryThresholds,
    reportJsonPath,
  });
}

runVerificationCli({
  scriptName: "design-verify-ssot-progress-regressions.mjs",
  verify: runRegressionGateCli,
  successMessage: "design:verify: ssot progress regression check completed",
});
