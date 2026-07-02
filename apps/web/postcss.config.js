export default {
  plugins: {
    "@tailwindcss/postcss": {
      sources: [
        "src/**/*.{js,jsx,ts,tsx}",
        "../../packages/ui/src/**/*.{ts,tsx}"
      ]
    },
  },
};
