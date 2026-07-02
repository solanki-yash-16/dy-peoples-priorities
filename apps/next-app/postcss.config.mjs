const config = {
  plugins: {
    "@tailwindcss/postcss": {
      sources: [
        "app/**/*.{js,jsx,ts,tsx}",
        "../../packages/ui/src/**/*.{ts,tsx}"
      ]
    },
  },
};

export default config;
