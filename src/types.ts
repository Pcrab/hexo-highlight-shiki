import type { BundledTheme, SpecialTheme } from "shiki";

export interface ShikiConfig {
    theme?: BundledTheme | SpecialTheme;
    themes?: {
        light: BundledTheme | SpecialTheme;
        dark: BundledTheme | SpecialTheme;
    };
    languages?: (
        | {
              name?: string;
              path?: string;
          }
        | string
    )[];
    loadAllLanguages?: boolean;
}
