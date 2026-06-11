#!/usr/bin/env node

import { ROOT } from "./design-sync/shared.mjs";
import {
  assertAnyMatch,
  assertMatch,
  runVerificationCli,
  throwVerificationErrors,
  withRequiredVariants,
} from "./design-verify-assertions.mjs";
import { readNamedSources } from "./design-verify-source-files.mjs";
import { readCategorySpec } from "./design-verify-spec-paths.mjs";

const INPUTS_SPEC_PATH = "design/component-specs/inputs-core.json";
const FEEDBACK_SPEC_PATH = "design/component-specs/feedback-core.json";
const DISPLAY_SPEC_PATH = "design/component-specs/display-core.json";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function verifyComponentDrift({ root = ROOT } = {}) {
  const { spec: feedbackSpec, sourceDirPath: feedbackSourceDirPath } =
    readCategorySpec({ root, category: "feedback" });
  const { spec: displaySpec, sourceDirPath: displaySourceDirPath } =
    readCategorySpec({ root, category: "display" });
  const { spec: inputsSpec, sourceDirPath: inputsSourceDirPath } =
    readCategorySpec({ root, category: "inputs" });

  const button = inputsSpec.components?.button;
  const input = inputsSpec.components?.input;
  const badge = displaySpec.components?.badge;
  const label = inputsSpec.components?.label;
  const checkbox = inputsSpec.components?.checkbox;
  const separator = displaySpec.components?.separator;
  const switchComponent = inputsSpec.components?.switch;
  const textarea = inputsSpec.components?.textarea;
  const alert = feedbackSpec.components?.alert;
  const avatar = displaySpec.components?.avatar;
  const kbd = displaySpec.components?.kbd;
  const img = displaySpec.components?.img;
  const progress = feedbackSpec.components?.progress;
  const spinner = feedbackSpec.components?.spinner;
  const radioGroup = inputsSpec.components?.radioGroup;
  const slider = inputsSpec.components?.slider;
  const select = inputsSpec.components?.select;
  const toggleGroup = inputsSpec.components?.toggleGroup;
  const toolPill = displaySpec.components?.toolPill;

  const {
    button: buttonSource,
    input: inputSource,
    label: labelSource,
    checkbox: checkboxSource,
    switch: switchSource,
    textarea: textareaSource,
    radioGroup: radioGroupSource,
    slider: sliderSource,
    select: selectSource,
    toggleGroup: toggleGroupSource,
  } = readNamedSources(inputsSourceDirPath, {
    button: "ButtonVariants.ts",
    input: "Input.tsx",
    label: "Label.tsx",
    checkbox: "Checkbox.tsx",
    switch: "Switch.tsx",
    textarea: "Textarea.tsx",
    radioGroup: "RadioGroup.tsx",
    slider: "Slider.tsx",
    select: "Select.tsx",
    toggleGroup: "ToggleGroup.tsx",
  });

  const {
    badge: badgeSource,
    separator: separatorSource,
    avatar: avatarSource,
    kbd: kbdSource,
    img: imgSource,
    toolPill: toolPillSource,
  } = readNamedSources(displaySourceDirPath, {
    badge: "Badge.tsx",
    separator: "Separator.tsx",
    avatar: "Avatar.tsx",
    kbd: "Kbd.tsx",
    img: "Img.tsx",
    toolPill: "ToolPill.tsx",
  });

  const {
    alert: alertSource,
    progress: progressSource,
    spinner: spinnerSource,
  } = readNamedSources(feedbackSourceDirPath, {
    alert: "Alert.tsx",
    progress: "Progress.tsx",
    spinner: "Spinner.tsx",
  });

  const errors = [];

  withRequiredVariants({
    errors,
    componentSpec: button,
    componentKey: "button",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      buttonSource,
      /\bButtonVariantKey\b/,
      "Button should use generated ButtonVariantKey type"
    );
    assertMatch(
      errors,
      buttonSource,
      /\bbuttonDefaultVariantKey\b/,
      "Button should use generated buttonDefaultVariantKey"
    );

    for (const variant of button.variants) {
      if (!variant?.key) continue;
      assertMatch(
        errors,
        buttonSource,
        new RegExp(`\\b${escapeRegex(variant.key)}\\s*:`),
        `ButtonVariants.ts is missing "${variant.key}" variant from atoms.pen`
      );
    }

    const defaultVariant = button.variants.find((v) => v.key === "default");
    if (defaultVariant?.height === 36) {
      assertMatch(errors, buttonSource, /\bh-9\b/, 'Button default size should include "h-9"');
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[1] === 16) {
      assertMatch(errors, buttonSource, /\bpx-4\b/, 'Button default size should include "px-4"');
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[0] === 8) {
      assertMatch(errors, buttonSource, /\bpy-2\b/, 'Button default size should include "py-2"');
    }

    const outlineVariant = button.variants.find((v) => v.key === "outline");
    if (outlineVariant?.stroke?.thickness === 1) {
      assertMatch(
        errors,
        buttonSource,
        /\bborder border-border\b/,
        'Button outline variant should include "border border-border"'
      );
    }

    const linkVariant = button.variants.find((v) => v.key === "link");
    if (linkVariant?.text?.underline) {
      assertMatch(
        errors,
        buttonSource,
        /\bhover:underline\b/,
        'Button link variant should include "hover:underline"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: input,
    componentKey: "input",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      inputSource,
      /\bInputVariantKey\b/,
      "Input should use generated InputVariantKey type"
    );
    assertMatch(
      errors,
      inputSource,
      /\binputDefaultVariantKey\b/,
      "Input should use generated inputDefaultVariantKey"
    );
    assertMatch(
      errors,
      inputSource,
      /\bRecord<InputVariantKey,\s*string>/,
      "Input variant class map should be keyed by InputVariantKey"
    );
    assertMatch(
      errors,
      inputSource,
      /\binputVariantClasses\[inputState\]/,
      "Input should apply classes from inputVariantClasses map"
    );

    const has36Height = input.variants.some((v) => v?.height === 36);
    if (has36Height) {
      assertMatch(errors, inputSource, /\bh-9\b/, 'Input should include "h-9"');
    }

    const hasRounded8 = input.variants.some((v) => v?.cornerRadius === 8);
    if (hasRounded8) {
      assertAnyMatch(
        errors,
        inputSource,
        [/\brounded-md\b/, /\brounded-lg\b/],
        'Input should include "rounded-md" or "rounded-lg"'
      );
    }

    const hasStroke = input.variants.some((v) => v?.stroke?.thickness === 1);
    if (hasStroke) {
      assertMatch(errors, inputSource, /\bborder border-input\b/, 'Input should include "border border-input"');
    }

    const hasPlaceholderVariant = input.variants.some((v) => v?.key === "placeholder");
    if (hasPlaceholderVariant) {
      assertMatch(
        errors,
        inputSource,
        /\bplaceholder:text-muted-foreground\b/,
        'Input should include "placeholder:text-muted-foreground"'
      );
    }

    const hasDisabledVariant = input.variants.some((v) => v?.key === "disabled");
    if (hasDisabledVariant) {
      assertMatch(errors, inputSource, /\bdisabled:bg-muted\b/, 'Input should include "disabled:bg-muted"');
      assertMatch(
        errors,
        inputSource,
        /\bdisabled:text-muted-foreground\b/,
        'Input should include "disabled:text-muted-foreground"'
      );
      assertMatch(
        errors,
        inputSource,
        /\bdisabled:opacity-50\b/,
        'Input should include "disabled:opacity-50"'
      );
    }

    assertMatch(
      errors,
      inputSource,
      /\bfocus-visible:ring-ring\b/,
      'Input should include "focus-visible:ring-ring"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: badge,
    componentKey: "badge",
    specPath: DISPLAY_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      badgeSource,
      /\bBadgeVariantKey\b/,
      "Badge should use generated BadgeVariantKey type"
    );
    assertMatch(
      errors,
      badgeSource,
      /\bbadgeDefaultVariantKey\b/,
      "Badge should use generated badgeDefaultVariantKey"
    );
    assertMatch(
      errors,
      badgeSource,
      /\bRecord<BadgeVariantKey,\s*string>/,
      "Badge variant class map should be keyed by BadgeVariantKey"
    );

    const expectedVariantKeys = badge.variants
      .map((variant) => variant?.key)
      .filter(Boolean);
    for (const key of expectedVariantKeys) {
      assertMatch(
        errors,
        badgeSource,
        new RegExp(`\\b${escapeRegex(key)}\\s*:`),
        `Badge.tsx is missing "${key}" variant from atoms.pen`
      );
    }
    assertMatch(
      errors,
      badgeSource,
      /\bbadgeVariantClasses\[variant\]/,
      "Badge should apply classes from badgeVariantClasses map"
    );

    const defaultVariant = badge.variants.find((v) => v.key === "default");
    if (defaultVariant?.height === 20) {
      assertMatch(errors, badgeSource, /\btext-xs\b/, 'Badge default should include "text-xs"');
    }
    if (defaultVariant?.cornerRadius === 9999) {
      assertMatch(
        errors,
        badgeSource,
        /\brounded-full\b/,
        'Badge default should include "rounded-full"'
      );
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[1] === 10) {
      assertMatch(errors, badgeSource, /\bpx-2\.5\b/, 'Badge default should include "px-2.5"');
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[0] === 4) {
      assertAnyMatch(
        errors,
        badgeSource,
        [/\bpy-0\.5\b/, /\bpy-1\b/],
        'Badge default should include "py-0.5" or "py-1"'
      );
    }

    const hasOutline = badge.variants.some((v) => v?.key === "outline");
    if (hasOutline) {
      assertMatch(
        errors,
        badgeSource,
        /\bborder-border\b/,
        'Badge outline should include "border-border"'
      );
      assertMatch(
        errors,
        badgeSource,
        /\btext-foreground\b/,
        'Badge outline should include "text-foreground"'
      );
    }

    assertMatch(errors, badgeSource, /\bfocus:ring-ring\b/, 'Badge should include "focus:ring-ring"');
    },
  });

  if (!label || !label.sampleText) {
    errors.push("label spec is missing in design/component-specs/inputs-core.json");
  } else {
    if (label.sampleText.fontSize === 14) {
      assertMatch(errors, labelSource, /\btext-sm\b/, 'Label should include "text-sm"');
    }
    if (`${label.sampleText.fontWeight}` === "500") {
      assertMatch(errors, labelSource, /\bfont-medium\b/, 'Label should include "font-medium"');
    }
    assertMatch(
      errors,
      labelSource,
      /\btext-foreground\b/,
      'Label should include "text-foreground"'
    );
    assertMatch(
      errors,
      labelSource,
      /\bpeer-disabled:opacity-70\b/,
      'Label should include "peer-disabled:opacity-70"'
    );
  }

  withRequiredVariants({
    errors,
    componentSpec: checkbox,
    componentKey: "checkbox",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      checkboxSource,
      /\bCheckboxVariantKey\b/,
      "Checkbox should use generated CheckboxVariantKey type"
    );
    assertMatch(
      errors,
      checkboxSource,
      /\bcheckboxDefaultVariantKey\b/,
      "Checkbox should use generated checkboxDefaultVariantKey"
    );
    assertMatch(
      errors,
      checkboxSource,
      /\bRecord<CheckboxVariantKey,\s*string>/,
      "Checkbox state class map should be keyed by CheckboxVariantKey"
    );
    assertMatch(
      errors,
      checkboxSource,
      /\bcheckboxStateClasses\[checkboxState\]/,
      "Checkbox should apply classes from checkboxStateClasses map"
    );

    const has20Size = checkbox.variants.some((v) => v?.width === 20 && v?.height === 20);
    if (has20Size) {
      assertMatch(errors, checkboxSource, /\bh-5 w-5\b/, 'Checkbox should include "h-5 w-5"');
    }

    const hasCornerRadius4 = checkbox.variants.some((v) => v?.cornerRadius === 4);
    if (hasCornerRadius4) {
      assertMatch(
        errors,
        checkboxSource,
        /rounded-\[4px\]/,
        'Checkbox should include "rounded-[4px]"'
      );
    }

    const hasStroke = checkbox.variants.some((v) => v?.stroke?.thickness === 1);
    if (hasStroke) {
      assertMatch(
        errors,
        checkboxSource,
        /\bborder border-input\b/,
        'Checkbox should include "border border-input"'
      );
    }

    const hasCheckedVariant = checkbox.variants.some((v) => v?.key === "checked");
    if (hasCheckedVariant) {
      assertMatch(
        errors,
        checkboxSource,
        /\bbg-foreground\b/,
        'Checkbox checked state should include "bg-foreground"'
      );
      assertMatch(
        errors,
        checkboxSource,
        /\btext-background\b/,
        'Checkbox checked state should include "text-background"'
      );
    }

    const hasDisabledVariant = checkbox.variants.some((v) => v?.key === "disabled");
    if (hasDisabledVariant) {
      assertMatch(
        errors,
        checkboxSource,
        /\bdisabled:bg-muted\b/,
        'Checkbox disabled state should include "disabled:bg-muted"'
      );
      assertMatch(
        errors,
        checkboxSource,
        /\bdisabled:opacity-50\b/,
        'Checkbox disabled state should include "disabled:opacity-50"'
      );
    }

    assertMatch(
      errors,
      checkboxSource,
      /\bfocus-visible:ring-ring\b/,
      'Checkbox should include "focus-visible:ring-ring"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: separator,
    componentKey: "separator",
    specPath: DISPLAY_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      separatorSource,
      /\bSeparatorVariantKey\b/,
      "Separator should use generated SeparatorVariantKey type"
    );
    assertMatch(
      errors,
      separatorSource,
      /\bseparatorDefaultVariantKey\b/,
      "Separator should use generated separatorDefaultVariantKey"
    );
    assertMatch(
      errors,
      separatorSource,
      /\bRecord<SeparatorVariantKey,\s*string>/,
      "Separator orientation class map should be keyed by SeparatorVariantKey"
    );

    const hasHorizontal = separator.variants.some((v) => v?.key === "horizontal");
    const hasVertical = separator.variants.some((v) => v?.key === "vertical");

    if (hasHorizontal || hasVertical) {
      assertAnyMatch(
        errors,
        separatorSource,
        [/orientation\s*===\s*"horizontal"/, /separatorOrientationClasses\[orientation\]/],
        'Separator should branch on orientation="horizontal"'
      );
    }

    if (hasHorizontal) {
      const horizontalVariant = separator.variants.find((variant) => variant?.key === "horizontal");
      if (horizontalVariant?.height === 1) {
        assertMatch(
          errors,
          separatorSource,
          /h-\[1px\]/,
          'Separator horizontal state should include "h-[1px]"'
        );
      }
      if (horizontalVariant?.width === 200) {
        assertMatch(
          errors,
          separatorSource,
          /w-\[200px\]/,
          'Separator horizontal state should include "w-[200px]"'
        );
      }
    }

    if (hasVertical) {
      const verticalVariant = separator.variants.find((variant) => variant?.key === "vertical");
      if (verticalVariant?.width === 1) {
        assertMatch(
          errors,
          separatorSource,
          /w-\[1px\]/,
          'Separator vertical state should include "w-[1px]"'
        );
      }
      if (verticalVariant?.height === 24) {
        assertMatch(
          errors,
          separatorSource,
          /\bh-6\b/,
          'Separator vertical state should include "h-6"'
        );
      }
    }

    const hasStroke = separator.variants.some((v) => !v?.stroke && v?.fill);
    if (hasStroke) {
      assertMatch(
        errors,
        separatorSource,
        /\bbg-border\b/,
        'Separator should include "bg-border"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: switchComponent,
    componentKey: "switch",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      switchSource,
      /\bSwitchVariantKey\b/,
      "Switch should use generated SwitchVariantKey type"
    );
    assertMatch(
      errors,
      switchSource,
      /\bswitchDefaultVariantKey\b/,
      "Switch should use generated switchDefaultVariantKey"
    );
    assertMatch(
      errors,
      switchSource,
      /\bRecord<SwitchVariantKey,\s*string>/,
      "Switch state class map should be keyed by SwitchVariantKey"
    );

    const hasExpectedSize = switchComponent.variants.some(
      (v) => v?.width === 44 && v?.height === 24
    );
    if (hasExpectedSize) {
      assertAnyMatch(
        errors,
        switchSource,
        [/\bh-\[24px\] w-\[44px\]\b/, /\bh-6 w-11\b/, /\bw-11 h-6\b/],
        'Switch should include "h-[24px] w-[44px]" or equivalent "h-6 w-11"'
      );
    }

    const hasRounded = switchComponent.variants.some((v) => v?.cornerRadius === 9999);
    if (hasRounded) {
      assertMatch(
        errors,
        switchSource,
        /\brounded-full\b/,
        'Switch should include "rounded-full"'
      );
    }

    const hasUnchecked = switchComponent.variants.some((v) => v?.key === "unchecked");
    if (hasUnchecked) {
      assertMatch(
        errors,
        switchSource,
        /\bbg-secondary\b/,
        'Switch unchecked state should include "bg-secondary"'
      );
      assertAnyMatch(
        errors,
        switchSource,
        [/\bjustify-start\b/, /switchStateClasses\[switchState\]/],
        'Switch unchecked state should include "justify-start"'
      );
    }

    const hasChecked = switchComponent.variants.some((v) => v?.key === "checked");
    if (hasChecked) {
      assertMatch(
        errors,
        switchSource,
        /\bbg-foreground\b/,
        'Switch checked state should include "bg-foreground"'
      );
      assertMatch(
        errors,
        switchSource,
        /\bjustify-end\b/,
        'Switch checked state should include "justify-end"'
      );
    }

    assertMatch(
      errors,
      switchSource,
      /\bh-5 w-5\b/,
      'Switch thumb should include "h-5 w-5"'
    );
    assertMatch(
      errors,
      switchSource,
      /\bbg-background\b/,
      'Switch thumb should include "bg-background"'
    );
    assertMatch(
      errors,
      switchSource,
      /\bfocus-visible:ring-ring\b/,
      'Switch should include "focus-visible:ring-ring"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: textarea,
    componentKey: "textarea",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      textareaSource,
      /\bTextareaVariantKey\b/,
      "Textarea should use generated TextareaVariantKey type"
    );
    assertMatch(
      errors,
      textareaSource,
      /\btextareaDefaultVariantKey\b/,
      "Textarea should use generated textareaDefaultVariantKey"
    );
    assertMatch(
      errors,
      textareaSource,
      /\bRecord<TextareaVariantKey,\s*string>/,
      "Textarea variant class map should be keyed by TextareaVariantKey"
    );
    assertMatch(
      errors,
      textareaSource,
      /\btextareaVariantClasses\[textareaState\]/,
      "Textarea should apply classes from textareaVariantClasses map"
    );

    const has80Height = textarea.variants.some((v) => v?.height === 80);
    if (has80Height) {
      assertAnyMatch(
        errors,
        textareaSource,
        [/min-h-\[80px\]/, /\bh-20\b/],
        'Textarea should include "min-h-[80px]" or "h-20"'
      );
    }

    const hasRounded8 = textarea.variants.some((v) => v?.cornerRadius === 8);
    if (hasRounded8) {
      assertAnyMatch(
        errors,
        textareaSource,
        [/\brounded-md\b/, /\brounded-lg\b/],
        'Textarea should include "rounded-md" or "rounded-lg"'
      );
    }

    const hasStroke = textarea.variants.some((v) => v?.stroke?.thickness === 1);
    if (hasStroke) {
      assertMatch(
        errors,
        textareaSource,
        /\bborder border-input\b/,
        'Textarea should include "border border-input"'
      );
    }

    const hasPlaceholder = textarea.variants.some((v) => v?.key === "default");
    if (hasPlaceholder) {
      assertMatch(
        errors,
        textareaSource,
        /\bplaceholder:text-muted-foreground\b/,
        'Textarea should include "placeholder:text-muted-foreground"'
      );
    }

    const hasDisabled = textarea.variants.some((v) => v?.key === "disabled");
    if (hasDisabled) {
      assertMatch(
        errors,
        textareaSource,
        /\bdisabled:bg-muted\b/,
        'Textarea disabled state should include "disabled:bg-muted"'
      );
      assertMatch(
        errors,
        textareaSource,
        /\bdisabled:text-muted-foreground\b/,
        'Textarea disabled state should include "disabled:text-muted-foreground"'
      );
      assertMatch(
        errors,
        textareaSource,
        /\bdisabled:opacity-50\b/,
        'Textarea disabled state should include "disabled:opacity-50"'
      );
    }

    assertMatch(
      errors,
      textareaSource,
      /\bfocus-visible:ring-ring\b/,
      'Textarea should include "focus-visible:ring-ring"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: alert,
    componentKey: "alert",
    specPath: FEEDBACK_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      alertSource,
      /\bAlertVariantKey\b/,
      "Alert should use generated AlertVariantKey type"
    );
    assertMatch(
      errors,
      alertSource,
      /\balertDefaultVariantKey\b/,
      "Alert should use generated alertDefaultVariantKey"
    );
    assertMatch(
      errors,
      alertSource,
      /\bRecord<AlertVariantKey,\s*string>/,
      "Alert variant class map should be keyed by AlertVariantKey"
    );

    for (const variant of alert.variants) {
      if (!variant?.key) continue;
      assertMatch(
        errors,
        alertSource,
        new RegExp(`\\b${escapeRegex(variant.key)}\\s*:`),
        `Alert.tsx is missing "${variant.key}" variant from atoms.pen`
      );
    }

    const defaultVariant = alert.variants.find((v) => v.key === "default");
    if (Array.isArray(defaultVariant?.padding)) {
      if (defaultVariant.padding[0] === 12) {
        assertMatch(errors, alertSource, /\bpy-3\b/, 'Alert default should include "py-3"');
      }
      if (defaultVariant.padding[1] === 16) {
        assertMatch(errors, alertSource, /\bpx-4\b/, 'Alert default should include "px-4"');
      }
    }
    if (defaultVariant?.cornerRadius === 8) {
      assertMatch(errors, alertSource, /\brounded-lg\b/, 'Alert should include "rounded-lg"');
    }
    assertMatch(errors, alertSource, /\bborder\b/, 'Alert should include "border"');

    const hasDestructive = alert.variants.some((v) => v?.key === "destructive");
    if (hasDestructive) {
      assertMatch(
        errors,
        alertSource,
        /\bbg-destructive-subtle\b/,
        'Alert destructive variant should include "bg-destructive-subtle"'
      );
      assertMatch(
        errors,
        alertSource,
        /\bborder-destructive-border\b/,
        'Alert destructive variant should include "border-destructive-border"'
      );
    }

    assertMatch(
      errors,
      alertSource,
      /\bfont-medium\b/,
      'Alert title should include "font-medium"'
    );
    assertMatch(errors, alertSource, /\btext-sm\b/, 'Alert body should include "text-sm"');
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: avatar,
    componentKey: "avatar",
    specPath: DISPLAY_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      avatarSource,
      /\bAvatarVariantKey\b/,
      "Avatar should use generated AvatarVariantKey type"
    );
    assertMatch(
      errors,
      avatarSource,
      /\bRecord<AvatarVariantKey,\s*string>/,
      "Avatar slot class map should be keyed by AvatarVariantKey"
    );

    const has40Size = avatar.variants.some((v) => v?.width === 40 && v?.height === 40);
    if (has40Size) {
      assertMatch(errors, avatarSource, /\bh-10 w-10\b/, 'Avatar should include "h-10 w-10"');
    }

    const hasRounded = avatar.variants.some((v) => v?.cornerRadius === 9999);
    if (hasRounded) {
      assertMatch(
        errors,
        avatarSource,
        /\brounded-full\b/,
        'Avatar should include "rounded-full"'
      );
    }

    const hasFallback = avatar.variants.some((v) => v?.key === "fallback");
    if (hasFallback) {
      assertMatch(
        errors,
        avatarSource,
        /\bbg-secondary\b/,
        'Avatar fallback should include "bg-secondary"'
      );
      assertMatch(
        errors,
        avatarSource,
        /\btext-muted-foreground\b/,
        'Avatar fallback should include "text-muted-foreground"'
      );
      assertMatch(
        errors,
        avatarSource,
        /\btext-sm\b/,
        'Avatar fallback should include "text-sm"'
      );
      assertMatch(
        errors,
        avatarSource,
        /\bfont-medium\b/,
        'Avatar fallback should include "font-medium"'
      );
    }

    const hasImage = avatar.variants.some((v) => v?.key === "image");
    if (hasImage) {
      assertMatch(
        errors,
        avatarSource,
        /\baspect-square h-full w-full\b/,
        'Avatar image should include "aspect-square h-full w-full"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: kbd,
    componentKey: "kbd",
    specPath: DISPLAY_SPEC_PATH,
    run: () => {
    const has20Height = kbd.variants.some((v) => v?.height === 20);
    if (has20Height) {
      assertMatch(errors, kbdSource, /\bh-5\b/, 'Kbd should include "h-5"');
    }

    const hasRounded4 = kbd.variants.some((v) => v?.cornerRadius === 4);
    if (hasRounded4) {
      assertMatch(
        errors,
        kbdSource,
        /rounded-\[4px\]/,
        'Kbd should include "rounded-[4px]"'
      );
    }

    const hasStroke = kbd.variants.some((v) => v?.stroke?.thickness === 1);
    if (hasStroke) {
      assertMatch(
        errors,
        kbdSource,
        /\bborder border-input\b/,
        'Kbd should include "border border-input"'
      );
    }

    const defaultVariant = kbd.variants.find((v) => v?.key === "key");
    if (Array.isArray(defaultVariant?.padding)) {
      if (defaultVariant.padding[1] === 6) {
        assertMatch(errors, kbdSource, /\bpx-1\.5\b/, 'Kbd should include "px-1.5"');
      }
      if (defaultVariant.padding[0] === 4) {
        assertMatch(
          errors,
          kbdSource,
          /\bitems-center\b/,
          'Kbd should keep centered content for compact key height'
        );
      }
    }

    assertMatch(errors, kbdSource, /\bbg-secondary\b/, 'Kbd should include "bg-secondary"');
    assertMatch(errors, kbdSource, /text-\[10px\]/, 'Kbd should include "text-[10px]"');
    assertMatch(
      errors,
      kbdSource,
      /\btext-muted-foreground\b/,
      'Kbd should include "text-muted-foreground"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: img,
    componentKey: "img",
    specPath: DISPLAY_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      imgSource,
      /\bImgVariantKey\b/,
      "Img should use generated ImgVariantKey type"
    );
    assertMatch(
      errors,
      imgSource,
      /\bimgDefaultVariantKey\b/,
      "Img should use generated imgDefaultVariantKey"
    );
    assertMatch(
      errors,
      imgSource,
      /\bRecord<ImgVariantKey,\s*string>/,
      "Img opacity class map should be keyed by ImgVariantKey"
    );
    assertMatch(
      errors,
      imgSource,
      /\bimgOpacityClasses\[status\]/,
      "Img should apply opacity classes from imgOpacityClasses map"
    );

    const hasSquareVariant = img.variants.some((v) => v?.width === 256 && v?.height === 256);
    if (hasSquareVariant) {
      assertMatch(
        errors,
        imgSource,
        /\brounded-lg\b/,
        'Img container should include "rounded-lg"'
      );
    }

    const hasLoading = img.variants.some((v) => v?.key === "loading");
    if (hasLoading) {
      assertMatch(
        errors,
        imgSource,
        /\bbg-secondary\b/,
        'Img loading state should include "bg-secondary"'
      );
      assertMatch(
        errors,
        imgSource,
        /\banimate-pulse\b/,
        'Img loading state should include "animate-pulse"'
      );
    }

    const hasError = img.variants.some((v) => v?.key === "error");
    if (hasError) {
      assertMatch(
        errors,
        imgSource,
        /\btext-muted-foreground\b/,
        'Img error state should include "text-muted-foreground"'
      );
      assertMatch(
        errors,
        imgSource,
        /\btext-xs\b/,
        'Img error label should include "text-xs"'
      );
      assertMatch(
        errors,
        imgSource,
        /\bh-8 w-8\b/,
        'Img error icon should include "h-8 w-8"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: progress,
    componentKey: "progress",
    specPath: FEEDBACK_SPEC_PATH,
    run: () => {
    const progressBar = progress.variants.find((v) => v?.key === "bar");
    if (progressBar?.height === 16) {
      assertMatch(
        errors,
        progressSource,
        /\bh-4\b/,
        'Progress track should include "h-4"'
      );
    }
    if (progressBar?.cornerRadius === 9999) {
      assertMatch(
        errors,
        progressSource,
        /\brounded-full\b/,
        'Progress track should include "rounded-full"'
      );
    }

    assertMatch(
      errors,
      progressSource,
      /\bbg-secondary\b/,
      'Progress track should include "bg-secondary"'
    );
    assertMatch(
      errors,
      progressSource,
      /\bbg-foreground\b/,
      'Progress fill should include "bg-foreground"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: spinner,
    componentKey: "spinner",
    specPath: FEEDBACK_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      spinnerSource,
      /\bSpinnerVariantKey\b/,
      "Spinner should use generated SpinnerVariantKey type"
    );
    assertMatch(
      errors,
      spinnerSource,
      /\bspinnerDefaultVariantKey\b/,
      "Spinner should use generated spinnerDefaultVariantKey"
    );
    assertMatch(
      errors,
      spinnerSource,
      /\bRecord<SpinnerVariantKey,\s*string>/,
      "Spinner size map should be keyed by SpinnerVariantKey"
    );

    for (const variant of spinner.variants) {
      if (!variant?.key) continue;
      assertMatch(
        errors,
        spinnerSource,
        new RegExp(`\\b${escapeRegex(variant.key)}\\s*:`),
        `Spinner.tsx is missing "${variant.key}" size mapping from atoms.pen`
      );
    }
    assertMatch(
      errors,
      spinnerSource,
      /\bspinnerSizeClasses\[size\]/,
      "Spinner should apply sizes from spinnerSizeClasses map"
    );

    const hasSm = spinner.variants.some((v) => v?.key === "sm" && v?.width === 12);
    if (hasSm) {
      assertMatch(errors, spinnerSource, /\bh-3 w-3\b/, 'Spinner "sm" should include "h-3 w-3"');
    }

    const hasDefault = spinner.variants.some((v) => v?.key === "default" && v?.width === 16);
    if (hasDefault) {
      assertMatch(
        errors,
        spinnerSource,
        /\bh-4 w-4\b/,
        'Spinner "default" should include "h-4 w-4"'
      );
    }

    const hasLg = spinner.variants.some((v) => v?.key === "lg" && v?.width === 24);
    if (hasLg) {
      assertMatch(errors, spinnerSource, /\bh-6 w-6\b/, 'Spinner "lg" should include "h-6 w-6"');
    }

    assertMatch(
      errors,
      spinnerSource,
      /\banimate-spin\b/,
      'Spinner should include "animate-spin"'
    );
    assertMatch(
      errors,
      spinnerSource,
      /\btext-muted-foreground\b/,
      'Spinner should include "text-muted-foreground"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: radioGroup,
    componentKey: "radioGroup",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      radioGroupSource,
      /\bRadioGroupVariantKey\b/,
      "RadioGroup should use generated RadioGroupVariantKey type"
    );
    assertMatch(
      errors,
      radioGroupSource,
      /\bradioGroupDefaultVariantKey\b/,
      "RadioGroup should use generated radioGroupDefaultVariantKey"
    );
    assertMatch(
      errors,
      radioGroupSource,
      /\bRecord<RadioGroupVariantKey,\s*string>/,
      "RadioGroup item state class map should be keyed by RadioGroupVariantKey"
    );

    const hasUnchecked = radioGroup.variants.some((v) => v?.key === "unchecked");
    const hasChecked = radioGroup.variants.some((v) => v?.key === "checked");

    const has16Size = radioGroup.variants.some((v) => v?.width === 16 && v?.height === 16);
    if (has16Size) {
      assertMatch(
        errors,
        radioGroupSource,
        /\bh-4 w-4\b/,
        'RadioGroup item should include "h-4 w-4"'
      );
    }

    assertMatch(
      errors,
      radioGroupSource,
      /\brounded-(full|lg)\b/,
      'RadioGroup item should include "rounded-full" or "rounded-lg"'
    );

    if (hasUnchecked) {
      assertMatch(
        errors,
        radioGroupSource,
        /\bborder-input\b/,
        'RadioGroup unchecked state should include "border-input"'
      );
    }

    if (hasChecked) {
      assertMatch(
        errors,
        radioGroupSource,
        /\bborder-foreground\b/,
        'RadioGroup checked state should include "border-foreground"'
      );
      assertMatch(
        errors,
        radioGroupSource,
        /\bh-2\.5 w-2\.5\b/,
        'RadioGroup checked dot should include "h-2.5 w-2.5"'
      );
      assertMatch(
        errors,
        radioGroupSource,
        /\bbg-foreground\b/,
        'RadioGroup checked dot should include "bg-foreground"'
      );
    }

    assertMatch(
      errors,
      radioGroupSource,
      /\bfocus-visible:ring-ring\b/,
      'RadioGroup item should include "focus-visible:ring-ring"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: slider,
    componentKey: "slider",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    const defaultVariant = slider.variants.find((v) => v?.key === "default");
    if (defaultVariant?.height === 20) {
      assertMatch(errors, sliderSource, /\bh-5\b/, 'Slider track should include "h-5"');
    }

    if (defaultVariant?.cornerRadius === 10) {
      assertMatch(
        errors,
        sliderSource,
        /\brounded-full\b/,
        'Slider track should include "rounded-full"'
      );
    }

    assertMatch(errors, sliderSource, /\bbg-input\b/, 'Slider track should include "bg-input"');
    assertMatch(
      errors,
      sliderSource,
      /\[\&::\-webkit-slider-thumb\]:h-5/,
      'Slider thumb should include "h-5"'
    );
    assertMatch(
      errors,
      sliderSource,
      /\[\&::\-webkit-slider-thumb\]:w-5/,
      'Slider thumb should include "w-5"'
    );
    assertMatch(
      errors,
      sliderSource,
      /\[\&::\-webkit-slider-thumb\]:border-foreground/,
      'Slider thumb should include "border-foreground"'
    );
    assertMatch(
      errors,
      sliderSource,
      /\[\&::\-webkit-slider-thumb\]:bg-background/,
      'Slider thumb should include "bg-background"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: select,
    componentKey: "select",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    const defaultVariant = select.variants.find((v) => v?.key === "default");
    if (defaultVariant?.height === 36) {
      assertMatch(errors, selectSource, /\bh-9\b/, 'Select should include "h-9"');
    }
    if (defaultVariant?.height === 40) {
      assertMatch(errors, selectSource, /\bh-10\b/, 'Select should include "h-10"');
    }
    if (defaultVariant?.cornerRadius === 8) {
      assertAnyMatch(
        errors,
        selectSource,
        [/\brounded-md\b/, /\brounded-lg\b/],
        'Select should include "rounded-md" or "rounded-lg"'
      );
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[1] === 12) {
      assertMatch(errors, selectSource, /\bpx-3\b/, 'Select should include "px-3"');
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[0] === 8) {
      assertMatch(errors, selectSource, /\bpy-2\b/, 'Select should include "py-2"');
    }

    assertMatch(errors, selectSource, /\bborder-input\b/, 'Select should include "border-input"');
    assertMatch(
      errors,
      selectSource,
      /\bplaceholder:text-muted-foreground\b/,
      'Select should include "placeholder:text-muted-foreground"'
    );
    assertMatch(
      errors,
      selectSource,
      /\bfocus:ring-ring\b/,
      'Select should include "focus:ring-ring"'
    );
    assertMatch(
      errors,
      selectSource,
      /\bdisabled:bg-muted\b/,
      'Select disabled state should include "disabled:bg-muted"'
    );
    assertMatch(
      errors,
      selectSource,
      /\bh-4 w-4\b/,
      'Select chevron should include "h-4 w-4"'
    );
    assertMatch(
      errors,
      selectSource,
      /\btext-muted-foreground\b/,
      'Select chevron should include "text-muted-foreground"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: toggleGroup,
    componentKey: "toggleGroup",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      toggleGroupSource,
      /\bToggleGroupVariantKey\b/,
      "ToggleGroup should use generated ToggleGroupVariantKey type"
    );
    assertMatch(
      errors,
      toggleGroupSource,
      /\btoggleGroupDefaultVariantKey\b/,
      "ToggleGroup should use generated toggleGroupDefaultVariantKey"
    );
    assertMatch(
      errors,
      toggleGroupSource,
      /\bRecord<ToggleGroupVariantKey,\s*string>/,
      "ToggleGroup variant class map should be keyed by ToggleGroupVariantKey"
    );

    const hasDefault = toggleGroup.variants.some((v) => v?.key === "default");
    const hasOutline = toggleGroup.variants.some((v) => v?.key === "outline");

    const hasHeight36 = toggleGroup.variants.some((v) => v?.height === 36);
    if (hasHeight36) {
      assertMatch(
        errors,
        toggleGroupSource,
        /\bh-9\b/,
        'ToggleGroup item should include "h-9"'
      );
    }

    const hasRounded8 = toggleGroup.variants.some((v) => v?.cornerRadius === 8);
    if (hasRounded8) {
      assertAnyMatch(
        errors,
        toggleGroupSource,
        [/\brounded-md\b/, /\brounded-lg\b/],
        'ToggleGroup item should include "rounded-md" or "rounded-lg"'
      );
    }

    if (hasDefault) {
      assertMatch(
        errors,
        toggleGroupSource,
        /\bbg-secondary\b/,
        'ToggleGroup default variant should include "bg-secondary"'
      );
      assertMatch(
        errors,
        toggleGroupSource,
        /\btext-foreground\b/,
        'ToggleGroup default variant should include "text-foreground"'
      );
    }

    if (hasOutline) {
      assertMatch(
        errors,
        toggleGroupSource,
        /\bborder border-input\b/,
        'ToggleGroup outline variant should include "border border-input"'
      );
      assertMatch(
        errors,
        toggleGroupSource,
        /\bbg-transparent\b/,
        'ToggleGroup outline variant should include "bg-transparent"'
      );
    }

    assertMatch(
      errors,
      toggleGroupSource,
      /\bfocus-visible:ring-ring\b/,
      'ToggleGroup item should include "focus-visible:ring-ring"'
    );
    assertMatch(
      errors,
      toggleGroupSource,
      /\bdata-\[state=on\]:bg-foreground\b/,
      'ToggleGroup on-state should include "data-[state=on]:bg-foreground"'
    );
    assertMatch(
      errors,
      toggleGroupSource,
      /\bdata-\[state=on\]:text-background\b/,
      'ToggleGroup on-state should include "data-[state=on]:text-background"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: toolPill,
    componentKey: "toolPill",
    specPath: DISPLAY_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      toolPillSource,
      /\bToolPillVariantKey\b/,
      "ToolPill should use generated ToolPillVariantKey type"
    );
    assertMatch(
      errors,
      toolPillSource,
      /\btoolPillDefaultVariantKey\b/,
      "ToolPill should use generated toolPillDefaultVariantKey"
    );

    const primaryVariant = toolPill.variants.find((v) => v?.key === "primary");
    const secondaryVariant = toolPill.variants.find((v) => v?.key === "secondary");
    const dangerVariant = toolPill.variants.find((v) => v?.key === "danger");

    for (const variant of ["primary", "secondary", "danger"]) {
      assertMatch(
        errors,
        toolPillSource,
        new RegExp(`\\b${escapeRegex(variant)}\\s*:`),
        `ToolPill.tsx is missing "${variant}" variant mapping`
      );
    }

    if (
      primaryVariant?.cornerRadius === 12 ||
      secondaryVariant?.cornerRadius === 12 ||
      dangerVariant?.cornerRadius === 12
    ) {
      assertMatch(errors, toolPillSource, /\brounded-xl\b/, 'ToolPill should include "rounded-xl"');
    }

    assertMatch(
      errors,
      toolPillSource,
      /\bisActive \? variantClasses\[variant\]\.active : variantClasses\[variant\]\.inactive\b/,
      "ToolPill should apply state classes from variant map"
    );

    assertMatch(errors, toolPillSource, /\bp-1\.5\b/, 'ToolPill should include "p-1.5" size class');
    assertMatch(errors, toolPillSource, /\bp-2\.5\b/, 'ToolPill should include "p-2.5" size class');
    assertMatch(errors, toolPillSource, /\bp-3\.5\b/, 'ToolPill should include "p-3.5" size class');

    if (
      primaryVariant?.children?.length ||
      secondaryVariant?.children?.length ||
      dangerVariant?.children?.length
    ) {
      assertMatch(
        errors,
        toolPillSource,
        /size=\{iconSizes\[size\]\}/,
        "ToolPill icon size should be controlled by iconSizes[size]"
      );
    }

    if (dangerVariant?.fill) {
      assertMatch(
        errors,
        toolPillSource,
        /\bbg-destructive-subtle text-destructive-subtle-foreground\b/,
        'ToolPill danger inactive state should include "bg-destructive-subtle text-destructive-subtle-foreground"'
      );
      assertMatch(
        errors,
        toolPillSource,
        /\bbg-destructive-strong text-destructive-strong-foreground\b/,
        'ToolPill danger active state should include "bg-destructive-strong text-destructive-strong-foreground"'
      );
    }
    },
  });

  throwVerificationErrors({
    errors,
    heading: "design:verify: component drift detected",
  });
}

runVerificationCli({
  scriptName: "design-verify-component-drift.mjs",
  verify: verifyComponentDrift,
  successMessage: "design:verify: component drift check passed",
});
