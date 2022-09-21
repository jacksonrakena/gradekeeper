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
        //#fafafa
        //old:"#f7f3f7"
        background: mode("#f7f3f7", themeConstants.darkModePageBackground)(props),
      },
    }),
  },
  colors: {
    brand: {
      "50": "#e7fcf2",
      "100": "#95f3c7",
      "200": "#45df96",
      "300": "#3abb7e",
      "400": "#33a771",
      "500": "#2b8d5f",
      "600": "#257750",
      "700": "#1d6041",
      "800": "#195137",
      "900": "#123a27",
    },
  },
});

export default theme;
