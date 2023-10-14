import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import jwtDecode from "jwt-decode";
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

export const SessionState = atomWithStorage<UserSessionTicket | null>("GK_APP_SESSION", null, {
  getItem: (key, initialValue) => {
    let token = getToken();
    if (token) {
      var ust: UserSessionTicket = jwtDecode(token);
      ust.token = token;
      if (ust.exp && ust.exp > Date.now() / 1000) {
        window.localStorage.setItem(key, token);
        console.log("Loaded token from search parameters. Clearing search. Expiry: " + new Date(ust.exp * 1000));
        window.location.search = "";
        return ust;
      }
    } else if (window.localStorage.getItem(key)) {
      token = window.localStorage.getItem(key)!;
      ust = jwtDecode(token);
      ust.token = token;
      if (ust.exp && ust.exp > Date.now() / 1000) {
        console.log("Loaded token from local storage. Expiry: " + new Date(ust.exp * 1000));
        return ust;
      }
    }
    return null;
  },
  setItem: (key, value) => {
    if (!value) {
      console.log("Logging out. Clearing search and local storage.");
      window.location.search = "";
      window.localStorage.removeItem("GK_APP_SESSION");
    }
  },
  removeItem: (key) => {
    window.localStorage.removeItem(key);
  },
});

export const useAuth = () => useAtomValue(AuthState);
export const useLogout = () => {
  const cookie = useSetAtom(SessionState);
  return () => cookie(null);
};
export const AuthState = atom<AuthStateContext>((get) => {
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
});
