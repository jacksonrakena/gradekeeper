import { AtomEffect } from "recoil";

export const persistToLocalStorage: (key: string) => AtomEffect<any> =
  (key: any) =>
  ({ setSelf, onSet }) => {
    if (!global.window) return;
    const savedValue = window.localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
