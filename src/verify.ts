import type { ShikiConfig } from "./types";

export const verifyConfig = (config: ShikiConfig): void => {
    if (!config.theme && !config.themes) {
        throw new Error("Shiki config must have a theme or themes");
    }

    if (config.theme && config.themes) {
        throw new Error("Shiki config cannot have both theme and themes");
    }

    if (config.theme && typeof config.theme !== "string") {
        throw new Error("Theme must be a string");
    }

    if (config.themes) {
        if (config.themes.light && typeof config.themes.light !== "string") {
            throw new Error("Light theme must be a string");
        }

        if (config.themes.dark && typeof config.themes.dark !== "string") {
            throw new Error("Dark theme must be a string");
        }
    }

    if (config.languages) {
        for (const lang of config.languages) {
            if (typeof lang === "string") {
                continue;
            }

            if (!lang.name) {
                throw new Error("Language config must have a name");
            }

            if (!lang.path) {
                throw new Error("Language config must have a path");
            }
        }
    }
};
