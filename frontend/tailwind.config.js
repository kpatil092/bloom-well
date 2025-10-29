/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4FAF9C",
        secondary: "#F6A57F",
        tertiary: "#A7DCA6",
        col1: "#5C7C89",
        col2: "#DCE8E5",
        col3: "#F3EFEA",
        col4: "#FFFDFB",
        background: "#F9F9F6",
      },
    },
  },
  plugins: [],
};
