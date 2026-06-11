#!/usr/bin/env node

import fs from "node:fs";

function parseCliArgs(rawArgs) {
  let inputPath = null;
  let outcome = null;
  let policyPath = null;

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];

    if (arg.startsWith("--input=")) {
      inputPath = arg.slice("--input=".length);
      continue;
    }
    if (arg.startsWith("--outcome=")) {
      outcome = arg.slice("--outcome=".length);
      continue;
    }
    if (arg.startsWith("--policy=")) {
      policyPath = arg.slice("--policy=".length);
      continue;
    }

    if (arg === "--input" || arg === "--outcome" || arg === "--policy") {
      const value = rawArgs[index + 1];
      if (typeof value !== "string" || value.startsWith("--")) {
        throw new Error(`design:verify: ${arg} requires a value`);
      }
      if (arg === "--input") inputPath = value;
      if (arg === "--outcome") outcome = value;
      if (arg === "--policy") policyPath = value;
      index += 1;
    }
  }

  if (!inputPath) {
    throw new Error("design:verify: ssot regression summary requires --input=<json-path>");
  }

  return { inputPath, outcome, policyPath };
}

function formatOutcome(outcome, reportPassed) {
  if (outcome) return outcome;
  return reportPassed ? "success" : "failure";
}

function formatRegressionLine(regression) {
  return `- ${regression.section}/${regression.category}: delta=+${regression.delta} (allowed: +${regression.allowedDelta})`;
}

function formatSummaryMarkdown({ report, outcome, policyPath }) {
  const lines = [
    "## SSOT Regression Gate",
    "",
    `- policy: \`${policyPath ?? report.categoryThresholdsPath ?? "none"}\``,
    `- result: \`${formatOutcome(outcome, report.passed)}\``,
    `- metric regressions: ${report.metricRegressionCount ?? "n/a"}`,
    `- category regressions: ${report.categoryRegressionCount ?? "n/a"}`,
  ];

  if (Array.isArray(report.metricRegressions) && report.metricRegressions.length > 0) {
    lines.push("");
    lines.push("### Metric Regressions");
    for (const regression of report.metricRegressions) {
      lines.push(
        `- ${regression.key}: base=${regression.base}, head=${regression.head}, delta=${regression.delta}`
      );
    }
  }

  if (Array.isArray(report.categoryRegressions) && report.categoryRegressions.length > 0) {
    lines.push("");
    lines.push("### Category Regressions");
    for (const regression of report.categoryRegressions) {
      lines.push(formatRegressionLine(regression));
    }
  }

  return `${lines.join("\n")}\n`;
}

function main() {
  const { inputPath, outcome, policyPath } = parseCliArgs(process.argv.slice(2));
  const report = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  process.stdout.write(formatSummaryMarkdown({ report, outcome, policyPath }));
}

main();
