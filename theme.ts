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
    global: (props) => ({
      "html, body": {
        background: mode("#f7f3f7", themeConstants.darkModePageBackground)(props),
      },
    }),
  },
});

export default theme;
