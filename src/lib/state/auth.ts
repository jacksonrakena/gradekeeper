import jwtDecode from "jwt-decode";
import { atom, AtomEffect, selector, useRecoilState, useRecoilValue } from "recoil";
import { routes } from "../net/fetch";

export interface UserCookie {
  exp: number;
  iat: number;
  id: string;
  name: string;
  picture: string;
}

export type AuthorizationState = "not_logged_in" | "logged_in";

export interface AuthStateContext {
  cookie: UserCookie | null;
  loggedIn: boolean;
  logIn: () => void;
}

const getCookie = (key: string) => {
  var b = window.document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
};
const getCookieFromUrl = (key: string) => {
  var b = new URLSearchParams(window.location.search).get("cookie")?.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
};
const resetCookie = (key: string) => {
  window.document.cookie = `${key}=;expires=Thu, 01-Jan-1970 00:00:01 GMT;`;
};
export const readCookie: (key: string) => AtomEffect<UserCookie | null> =
  (key: any) =>
  ({ setSelf, onSet }) => {
    let str = getCookie(key);

    if (!str) {
      let param = getCookieFromUrl("GK_COOKIE");
      if (param) {
        str = param;
        console.log("Decoded query param cookie: " + str);
        var rawCookie = new URLSearchParams(window.location.search).get("cookie");
        if (rawCookie) window.document.cookie = rawCookie;
      }
    }

    if (!str) {
      setSelf(null);
      return;
    } else {
      let decodedCookie: UserCookie = jwtDecode(str);
      if (decodedCookie && decodedCookie.exp && decodedCookie.exp > Date.now() / 1000) {
        setSelf(decodedCookie);
      } else {
        resetCookie(key);
        setSelf(null);
      }
    }

    onSet((newValue, _, isReset) => {
      resetCookie(key);
    });
  };

export const CookieState = atom<UserCookie | null>({
  key: "CookieState",
  default: null,
  effects: [readCookie("GK_COOKIE")],
});

export const useAuth = () => useRecoilValue(AuthState);
export const useLogout = () => {
  const cookie = useRecoilState(CookieState);
  return () => cookie[1](null);
};
export const AuthState = selector<AuthStateContext>({
  key: "AuthState",
  get: ({ get }) => {
    const cookie = get(CookieState);
    if (!cookie)
      return {
        cookie: null,
        loggedIn: false,
        logIn: () => {
          console.log("Logging in...");
          window.location.href = routes.auth.login();
        },
      };
    return {
      cookie: cookie,
      loggedIn: true,
      logIn: () => {
        console.log("Logging in...");
        window.location.href = routes.auth.login();
      },
    };
  },
});
