import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { defaultThemes } from "../theme";

export const ThemeNameState = atomWithStorage<keyof typeof defaultThemes>("theme_name", "Default");

export const ThemeState = atom<any>((get) => {
  return defaultThemes.Default;
  const n = get(ThemeNameState);
  if (!(n in defaultThemes)) return defaultThemes.Default;
  return defaultThemes[n];
});
