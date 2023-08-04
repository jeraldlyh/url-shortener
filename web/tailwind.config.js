/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'inter': ["Inter", "sans-serif"],
                'roboto': ["Roboto", "sans-serif"],
            },
            colors: {
                custom: {
                    black: "#111111",
                    gray: "#2F2F2F",
                    white: "#F6F6F6",
                    gold: "#FFCB74"
                }
            }
        },
    },
    plugins: [],
}