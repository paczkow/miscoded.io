export const theme = {
  accentColor: "",
  bgColor: "#fff",
  separatorColor: "",
  textPrimaryColor: "",
  textSecondaryColor: "",

  space: {
    none: 0,
    xsmall: 8,
    small: 16,
    medium: 24,
    large: 32,
    xlarge: 64,
    xxlarge: 96,
  },

  breakpoints: {
    minMedium: 768,
    minLarge: 1200,
  },
};

export type Space = keyof typeof theme.space;

export type Theme = typeof theme;
