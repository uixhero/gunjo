const themeExtend = require("./tailwind-theme-extend.cjs");

/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: themeExtend
    },
    plugins: [
        require("tailwindcss-animate")
    ],
};
