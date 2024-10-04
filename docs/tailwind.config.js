import colors from "tailwindcss/colors";
import { fontFamily } from "tailwindcss/defaultTheme";
export const chart1Colors = {
  1: "#D6E3E6",
  2: "#C8D3E0",
  3: "#B9C0DA",
  4: "#AEAAD5",
  5: "#B09BCF",
  6: "#B68CCA",
  7: "#C47CC5",
};

export const chart2Colors = {
  1: "#DDE5D7",
  2: "#CBDFC8",
  3: "#B9DABF",
  4: "#ABD6C0",
  5: "#9AD0C4",
  6: "#8BC5CB",
  7: "#7BA8C6",
};

export const chart3Colors = {
  1: "#F1CBDD",
  2: "#EFB9C7",
  3: "#EDA6AA",
  4: "#ED9E94",
  5: "#EBA17F",
  6: "#EAAD6C",
  7: "#E9C058",
};

export const chart5Colors = {
  1: "#4ACF97",
  2: "#93B84C",
  3: "#D9A104",
  4: "#EC8126",
  5: "#FF5F49",
};

const primaryOrangeColors = {
  50: "#FFEFED",
  100: "#FFCDC7",
  200: "#FFB5AB",
  300: "#FF9485",
  400: "#FF7F6D",
  500: "#FF5F49",
  600: "#E85642",
  700: "#B54334",
  800: "#8C3428",
  900: "#6B281F",
};

export const secondaryVioletColors = {
  25: "#F9F8FA",
  50: "#E9E8EB",
  100: "#BCB9C0",
  200: "#9C97A2",
  300: "#6E6877",
  400: "#524A5D",
  500: "#271D34",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./docs/pages/**/*.{tsx,jsx,ts,js}', "./docs/index.html"],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        "border-stroke": "rgb(var(--border-stroke))",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rbg(var(--primary-foreground))",
          dark: "rgb(var(--primary-dark))",
          orange: primaryOrangeColors,
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary-old))",
          blue: "rgb(var(--secondary-1))",
          yellow: "rgb(var(--secondary-2))",
          green: "rgb(var(--secondary-3))",
          violet: secondaryVioletColors,
        },
        chart2: chart2Colors,
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        green: {
          DEFAULT: "rgb(var(--green))",
          ...colors.green,
        },
        gray: {
          DEFAULT: "rgb(var(--text-gray))",
        },
        black: {
          DEFAULT: "rgb(var(--text-black))",
        },
        orange: {
          default: "rgb(var(--orange))",
          ...primaryOrangeColors,
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        lightGray: {
          DEFAULT: "rgb(var(--gray-stroke))",
          fill: "rgb(var(--gray-fill))",
        },
        star: {
          DEFAULT: "var(--star)",
          active: "var(--star-active)",
        },
        icon: {
          DEFAULT: "var(--icon)",
          active: "var(--icon-active)",
        },
        error: "#FF5F49",
      },
      width: {
        "icon-custom": "var(--icon-custom)",
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      borderColor: {
        input: secondaryVioletColors[50],
        "input-hover": `rgb(188 185 192 / 0.75)`, // seccondary violet 100
        "input-focus": "rgb(255 148 133 / 0.75)", // primary orange 300
      },
      fontFamily: {
        sans: ["Roboto Flex", ...fontFamily.sans],
        inter: ["Inter", ...fontFamily.sans],
        headings: ["Inter", ...fontFamily.sans],
        brand: ["Nekst Bold", ...fontFamily.sans],
      },
      height: {
        nav: "var(--nav-height)",
        screen: "var(--body-height)",
        "icon-custom": "var(--icon-custom)",
      },
      backgroundImage: {
        "app-bg": "url('/app-bg.png')",
      },
      boxShadow: {
        map: "var(--shadow-map)",
        box: "var(--shadow-block)",
        drop: "var(--shadow-drop)",
        "search-input": "var(--shadow-search-input)",
        tooltip: "var(--shadow-tooltip)",
        "input-focus": "0 0 5px 0px var(--tw-shadow-color)",
        "minimise-btn": "5px 2px 6px 0 rgba(0, 0, 0, 0.1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        progress: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        progress: "progress linear forwards 1s 1",
      },
    },
  },
  plugins: [],
}

