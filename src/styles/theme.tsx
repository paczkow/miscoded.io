export const theme = {
  accentColor: "",
  bgColor: "#fff",
  separatorColor: "",
  textPrimaryColor: "",
  textSecondaryColor: "",

  baseSpacing: 8,

  breakpoints: {
    maxWidthOfNarrowPaddingContainer: 364,
    maxWidthOfMobileContainer: 16 * 42, // 16px * 42rem
    maxWidthOfDesktopContainer: 18 * 42, // 18px * 42rem
    largeScreen: 1200,
  },
};

export type Theme = typeof theme;
