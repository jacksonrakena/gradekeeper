import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const Chakra: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <ChakraProvider theme={gradekeeperAppTheme}>{children}</ChakraProvider>;
};

const gradekeeperAppTheme = extendTheme({
  config: {
    initialColorMode: "system",
    useSystemColorMode: true,
  },
  styles: {
    global: (props: any) => ({
      "html, body": {
        background: mode("#f7f3f7", "#111")(props),
      },
    }),
  },
  colors: {
    brand: {
      "50": "#f9fafa",
      "100": "#f1f1f1",
      "200": "#e7e7e8",
      "300": "#d3d4d4",
      "400": "#acadad",
      "500": "#7e7f80",
      "600": "#535556",
      "700": "#353738",
      "800": "#1e2022",
      "900": "#181a1c",
    },
  },
});

const themeConstants = {
  darkModeContrastingColor: "rgb(38 38 38)",
  darkModePageBackground: "#111",
};

export default themeConstants;
