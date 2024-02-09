const COLORS = {
  primary: "#135656",
  secondary: "#1C8080",
  tertiary: "#FF7754",
  success: "#5cb85c",
  danger: "#ff0000",

  bg: "#F5F5F6",

  darkGray: "#797979",
  gray: "#b8b9be",
  gray2: "#d6d6d9",

  white: "#ffffff",
  lightWhite: "#ffffff",
};

const FONT = {
  regular: "PoppinsRegular",
  medium: "PoppinsMedium",
  bold: "PoppinsBold",
};

const SIZES = {
  light: 6,
  xxSmall: 8,
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, FONT, SIZES, SHADOWS };
