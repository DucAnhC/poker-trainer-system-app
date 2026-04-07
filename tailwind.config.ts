import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        surface: "hsl(var(--surface))",
        border: "hsl(var(--border))",
        accent: "hsl(var(--accent))",
        "accent-strong": "hsl(var(--accent-strong))",
        gold: "hsl(var(--gold))",
      },
      boxShadow: {
        panel: "0 18px 48px -22px rgba(8, 23, 32, 0.3)",
      },
      backgroundImage: {
        felt: "radial-gradient(circle at top, rgba(25, 131, 104, 0.18), transparent 48%)",
      },
    },
  },
  plugins: [],
};

export default config;
