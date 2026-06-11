export interface DocContent {
  title: string;
  description?: string;
  /** Markdown string for prose pages */
  body?: string;
}

export interface SectionLabels {
  props: string;
  usage: string;
  preview: string;
  code: string;
  viewDocumentation: string;
  openExample: string;
  fullScreen: string;
  examples: string;
  usedComponents: string;
  relatedComponents: string;
  copySpecForAi: string;
  copied: string;
  copyFailed: string;
}
