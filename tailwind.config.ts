import type { Config } from "tailwindcss";

const themeExtend = require("./tailwind-theme-extend.cjs");

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: themeExtend,
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
