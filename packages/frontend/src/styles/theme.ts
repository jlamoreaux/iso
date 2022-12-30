import { MantineThemeOverride, Tuple, DefaultMantineColor } from "@mantine/core";

type ExtendedCustomColors = "primaryColorName" | "secondaryColorName" | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}

const colors: Partial<
  Record<
    ExtendedCustomColors,
    [string, string, string, string, string, string, string, string, string, string]
  >
> = {
  salmon: [
    "#fbece9",
    "#f4c7bd",
    "#eda292",
    "#E68069",
    "#de583a",
    "#c53f21",
    "#99311a",
    "#6d2312",
    "#42150b",
    "#160704",
  ],
  // SEA_FOAM_GREEN IS BASED ON #A5D6D1.
  seaFoamGreen: [
    "#E4F3F1",
    "#D2EBE8",
    "#C0E2DF",
    "#B7DEDA",
    "#A5D6D1",
    "#8CC8C1",
    "#6EB0A6",
    "#4E988B",
    "#2F7F70",
    "#0F6765",
  ],
  // WHITE IS BASED ON #FFFFFF
  white: [
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#FFFFFF",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
  ],
  // BLACK IS BASED ON #000000
  black: [
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
  ],
  // PLUM IS BASED ON #312E5F
  plum: [
    "#f5f4f9",
    "#ebeaf3",
    "#e1e0ed",
    "#d7d6e7",
    "#CDC9E1",
    "#b9b4d5",
    "#a6a0c9",
    "#928cbd",
    "#7e77b1",
    "#6a62a5",
  ],
  // GOLD IS BASED ON #E6B469
  gold: [
    "#f8e9d2",
    "#f5e1c3",
    "#f0d2a5",
    "#ebc387",
    "#E6B469",
    "#dca24b",
    "#c78e2d",
    "#b57a0f",
    "#a36700",
    "#8f5400",
  ],
  // TAN IS BASED ON #F1DBB9
  tan: [
    "#fcf8f1",
    "#f9f1e3",
    "#f7e9d5",
    "#f4e2c7",
    "#f1dbb9",
    "#c1af94",
    "#a99982",
    "#8f8370",
    "#756e5e",
    "#5b584c",
  ],

  // GRAY IS BASED ON #BDBDBD, #686B6F and #E8E8E8
  gray: [
    "#e8e8e8",
    "#d6d6d6",
    "#c4c4c4",
    "#BDBDBD",
    "#b0b0b0",
    "#a3a3a3",
    "#969696",
    "#898989",
    "#7c7c7c",
    "#6f6f6f",
  ],
};

export enum FONTS {
  PRIMARY = "LaoMuangDon, Roboto, sans-serif",
  SECONDARY = "LaoSansPro, Roboto, sans-serif",
  TERTIARY = "PT Sans, Roboto, sans-serif",
}

const theme: MantineThemeOverride = {
  colorScheme: "light",
  colors: colors,
  primaryColor: "salmon",
  primaryShade: 4,
  // fontFamily: "LaoMuangDon, Roboto, sans-serif",
  headings: {
    fontFamily: "LaoSansDon, Roboto, sans-serif",
    sizes: {
      h1: {
        fontSize: 30,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: 24,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: 20,
        lineHeight: 1.2,
        fontWeight: 800,
      },
      h4: {
        fontSize: 18,
        lineHeight: 1.2,
      },
    },
  },
  // Default font size is 16px
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },
  // Default line height is 1.5
  lineHeight: 1.5,
  // Default font weight is 400
  // Default border radius is 3px
  shadows: {
    // Default shadow is used for all components
    // that have shadow prop set to true
    // or have shadow="sm" prop
    sm: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
    // Default shadow is used for all components
    // that have shadow="md" prop
    md: "0 4px 8px 0 rgba(0, 0, 0, 0.1)",
    // Default shadow is used for all components
    // that have shadow="lg" prop
    lg: "0 8px 16px 0 rgba(0, 0, 0, 0.1)",
    // Default shadow is used for all components
    // that have shadow="xl" prop
    xl: "0 16px 32px 0 rgba(0, 0, 0, 0.1)",
  },
  // Default transition timing function is ease
  transitionTimingFunction: "ease",
  black: "black",
  white: "white",
  // Default transition duration is 200ms
  dateFormat: "MM/DD/YYYY",
  focusRing: "auto",
  defaultRadius: "xl",
  radius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export default theme;
