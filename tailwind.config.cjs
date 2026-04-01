module.exports = {
  darkMode: ["class"],
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { primary: "var(--color-primary)", accent: "var(--color-accent)", bg: "var(--color-bg)", surface: "var(--color-surface)", text: "var(--color-text)", muted: "var(--color-muted)" },
    fontFamily: { display: "var(--font-display)", body: "var(--font-body)" }
  }},
  plugins: [require("tailwindcss-animate")]
};
