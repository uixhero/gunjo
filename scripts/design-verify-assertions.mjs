export function assertMatch(errors, content, pattern, message) {
  if (!pattern.test(content)) {
    errors.push(message);
  }
}

export function assertAnyMatch(errors, content, patterns, message) {
  if (!patterns.some((pattern) => pattern.test(content))) {
    errors.push(message);
  }
}

export function withRequiredVariants({
  errors,
  componentSpec,
  componentKey,
  specPath,
  run,
}) {
  if (!componentSpec || !Array.isArray(componentSpec.variants)) {
    errors.push(`${componentKey} spec is missing in ${specPath}`);
    return;
  }

  run();
}

export function throwVerificationErrors({ errors, heading }) {
  if (errors.length === 0) return;
  const body = errors.map((error) => `- ${error}`).join("\n");
  throw new Error(`${heading}\n${body}`);
}

export function throwLinesError(lines) {
  throw new Error(lines.join("\n"));
}

export function runVerificationCli({ scriptName, verify, successMessage }) {
  if (!process.argv[1] || !process.argv[1].endsWith(scriptName)) return;

  try {
    verify();
    console.log(successMessage);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
