import { atom, selector } from "recoil";
import { defaultThemes } from "../lib/theme/theme";
import { persistToLocalStorage } from "./utils";

export const ThemeNameState = atom<keyof typeof defaultThemes>({
  key: "ThemeNameState",
  dangerouslyAllowMutability: true,
  default: "Default",
  effects: [persistToLocalStorage("theme_name")],
});

export const ThemeState = selector<any>({
  key: "ThemeState",
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    const n = get(ThemeNameState);
    return defaultThemes[n];
  },
});
