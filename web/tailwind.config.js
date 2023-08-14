/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                primary: ['Poppins', 'sans-serif']
            },
            colors: {
                custom: {
                    black: "#111111",
                    gray: {
                        primary: "#2F2F2F",
                        secondary: "#BDBDBD"
                    },
                    white: "#F6F6F6",
                    gold: {
                        primary: "#FFCB74",
                        secondary: "#FFC35E"
                    },
                    qr: {
                        primary: "#FFCB74",
                        secondary: "#2F2F2F",
                        tertiary: "#D8D9DA"
                    }
                }
            }
        },
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    daisyui: {
        themes: ["dracula", "light"]
    }
}