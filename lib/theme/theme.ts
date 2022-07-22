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
        background: mode("#fafafa", themeConstants.darkModePageBackground)(props),
      },
    }),
  },
  colors: {
    brand: {
      "50": "#DFDFE1",
      "100": "#D5D5D8",
      "200": "#BFC0C4",
      "300": "#AAABB0",
      "400": "#95969D",
      "500": "#808189",
      "600": "#65656C",
      "700": "#4A4A4F",
      "800": "#2F2F32",
      "900": "#141415",
    },
  },
});

export default theme;
