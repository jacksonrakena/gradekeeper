import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import themeConstants from "./themeConstants";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles: {
    // @ts-ignore
    global: (props) => ({
      "html, body": {
        background: mode("#f7f3f7", themeConstants.darkModePageBackground)(props),
      },
    }),
  },
  colors: {
    brand_gr: {
      "50": "#F1F2F4",
      "100": "#D8DADF",
      "200": "#BEC2CB",
      "300": "#A5AAB6",
      "400": "#8B92A2",
      "500": "#727A8D",
      "600": "#5B6271",
      "700": "#444955",
      "800": "#2E3138",
      "900": "#17181C",
    },
    brand: {
      "50": "#F1F1F4",
      "100": "#D6D8E0",
      "200": "#BCBECC",
      "300": "#A2A5B8",
      "400": "#888CA5",
      "500": "#6E7391",
      "600": "#585C74",
      "700": "#424557",
      "800": "#2C2E3A",
      "900": "#16171D",
    },
    brand_pr: {
      "50": "#F0EFF6",
      "100": "#D6D2E5",
      "200": "#BCB5D4",
      "300": "#A298C3",
      "400": "#887BB2",
      "500": "#6E5EA1",
      "600": "#584B81",
      "700": "#423861",
      "800": "#2C2640",
      "900": "#161320",
    },
  },
});

export default theme;
