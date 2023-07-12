import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const regular = (
  theme: any,
  opts: any = {
    bg: ["#f7f3f7", "#111"],
  }
) => {
  return extendTheme({
    config,
    styles: {
      // @ts-ignore
      global: (props) => ({
        "html, body": {
          background: mode(opts.bg[0], opts.bg[1])(props),
        },
      }),
    },
    colors: {
      brand: theme,
    },
  });
};

export const defaultThemes = {
  Default: regular({
    "50": "#e9fcee",
    "100": "#b3eec3",
    "200": "#9ed2ac",
    "300": "#84b090",
    "400": "#769d81",
    "500": "#64856d",
    "600": "#54705c",
    "700": "#435a4a",
    "800": "#394c3e",
    "900": "#29372d",
  }),
  Pink: regular({
    "50": "#fff4fb",
    "100": "#fdd5f0",
    "200": "#fbade3",
    "300": "#f67acf",
    "400": "#dc6db9",
    "500": "#ba5c9c",
    "600": "#9d4e84",
    "700": "#7e3e6a",
    "800": "#6b3559",
    "900": "#4d2641",
  }),
  Yellow: regular({
    "50": "#fefefc",
    "100": "#fbf9ea",
    "200": "#f4eec2",
    "300": "#ece192",
    "400": "#dfce4b",
    "500": "#bba922",
    "600": "#95871c",
    "700": "#746915",
    "800": "#574f10",
    "900": "#48410d",
  }),
  Orange: regular({
    "50": "#fdfaf6",
    "100": "#f9ebdb",
    "200": "#f1d4b1",
    "300": "#e6b273",
    "400": "#dc9239",
    "500": "#c37b24",
    "600": "#a5681e",
    "700": "#835318",
    "800": "#674113",
    "900": "#553610",
  }),
  // IanPad: extendTheme({
  //   config,
  //   styles: {
  //     // @ts-ignore
  //     global: (props) => ({
  //       "html, body": {
  //         //#fafafa
  //         //old:"#f7f3f7"
  //         background: "#B9F6CA",
  //       },
  //     }),
  //   },
  //   colors: {
  //     brand: {
  //       "50": "#e9fcee",
  //       "100": "#b3eec3",
  //       "200": "#9ed2ac",
  //       "300": "#84b090",
  //       "400": "#769d81",
  //       "500": "#64856d",
  //       "600": "#54705c",
  //       "700": "#435a4a",
  //       "800": "#394c3e",
  //       "900": "#29372d",
  //     },
  //   },
  // }),
  Red: regular({
    "50": "#fdf6f5",
    "100": "#f8d9d7",
    "200": "#f2b7b4",
    "300": "#ea8c87",
    "400": "#e5726b",
    "500": "#dd4840",
    "600": "#c72d25",
    "700": "#a1241e",
    "800": "#891f19",
    "900": "#641712",
  }),
  Cyan: regular({
    "50": "#f4fbfd",
    "100": "#d0eef7",
    "200": "#bae7f3",
    "300": "#a2deee",
    "400": "#53c2e1",
    "500": "#2ab4d9",
    "600": "#24a2c4",
    "700": "#1e86a2",
    "800": "#196e85",
    "900": "#135567",
  }),
};
