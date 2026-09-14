/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "saudi-green": "#003B24",
        "saudi-emerald": "#00A651",
        "saudi-gold": "#C9A227",
        "saudi-white": "#F5F7F4",
        "saudi-black": "#000000",
        "saudi-red": "#D94A11",
      },
    },
  },
  plugins: [],
};
