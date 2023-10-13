import jwtDecode from "jwt-decode";
import { atom, AtomEffect, selector, useRecoilState, useRecoilValue } from "recoil";
import { routes } from "../net/fetch";

export interface UserSessionTicket {
  exp: number;
  iat: number;
  id: string;
  name: string;
  picture: string;
  token: string;
}

export type AuthorizationState = "not_logged_in" | "logged_in";

export interface AuthStateContext {
  session: UserSessionTicket | null;
  loggedIn: boolean;
  logIn: () => void;
}
const getToken = (): string | null => {
  var b = new URLSearchParams(window.location.search).get("token");
  return b;
};
export const tryReadSession: () => AtomEffect<UserSessionTicket | null> =
  () =>
  ({ setSelf, onSet }) => {
    let token = getToken();
    if (token) {
      var ust: UserSessionTicket = jwtDecode(token);
      ust.token = token;
      if (ust.exp && ust.exp > Date.now() / 1000) {
        setSelf(ust);
        window.localStorage.setItem("GK_APP_SESSION", token);
        console.log("Loaded token from search parameters. Clearing search. Expiry: " + new Date(ust.exp * 1000));
        window.location.search = "";
      }
    } else if (window.localStorage.getItem("GK_APP_SESSION")) {
      token = window.localStorage.getItem("GK_APP_SESSION")!;
      ust = jwtDecode(token);
      ust.token = token;
      if (ust.exp && ust.exp > Date.now() / 1000) {
        console.log("Loaded token from local storage. Expiry: " + new Date(ust.exp * 1000));
        setSelf(ust);
      }
    } else {
      setSelf(null);
    }

    onSet((newValue, _, isReset) => {
      if (!newValue) {
        console.log("Logging out. Clearing search and local storage.");
        window.location.search = "";
        window.localStorage.removeItem("GK_APP_SESSION");
      }
    });
  };

export const SessionState = atom<UserSessionTicket | null>({
  key: "CookieState",
  default: null,
  effects: [tryReadSession()],
});

export const useAuth = () => useRecoilValue(AuthState);
export const useLogout = () => {
  const cookie = useRecoilState(SessionState);
  return () => cookie[1](null);
};
export const AuthState = selector<AuthStateContext>({
  key: "AuthState",
  get: ({ get }) => {
    const cookie = get(SessionState);
    if (!cookie)
      return {
        session: null,
        loggedIn: false,
        logIn: () => {
          console.log("Logging in...");
          window.location.href = routes.auth.login() + "?redirectUrl=" + window.location.origin;
        },
      };
    return {
      session: cookie,
      loggedIn: true,
      logIn: () => {},
    };
  },
});
