import { useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { jwtDecode } from "jwt-decode";
import { routes } from "../net/fetch";

export interface Session {
  exp: number;
  iat: number;
  id: string;
  name: string;
  picture: string;
  token: string;
}

const SESSION_STATE_KEY = "GK_APP_SESSION";

export const getTicket = (authoritative: boolean = false): Session | null => {
  let token = new URLSearchParams(window.location.search).get("token");
  if (token) {
    var ust: Session = jwtDecode(token);
    ust.token = token;
    if (ust.exp && ust.exp > Date.now() / 1000) {
      window.localStorage.setItem(SESSION_STATE_KEY, token);
      if (authoritative) {
        console.log("Loaded session from search parameters. Expiry: " + new Date(ust.exp * 1000));
        window.location.search = "";
      }
      return ust;
    }
  } else if (window.localStorage.getItem(SESSION_STATE_KEY)) {
    token = window.localStorage.getItem(SESSION_STATE_KEY)!;
    ust = jwtDecode(token);
    ust.token = token;
    if (ust.exp && ust.exp > Date.now() / 1000) {
      if (authoritative) console.log("Loaded session from local storage. Expiry: " + new Date(ust.exp * 1000));
      return ust;
    }
  }
  return null;
};

export const SessionState = atomWithStorage<Session | null>(SESSION_STATE_KEY, null, {
  getItem: (key, initialValue) => {
    return getTicket(true);
  },
  setItem: (key, value) => {
    if (!value) {
      console.log("Logging out. Clearing search and local storage.");
      window.location.search = "";
      window.localStorage.removeItem(key);
    }
  },
  removeItem: (key) => {
    window.localStorage.removeItem(key);
  },
});

export const useSession = () => {
  return useAtomValue(SessionState);
};
export const useLogout = () => {
  const cookie = useSetAtom(SessionState);
  return () => cookie(null);
};
export const useLogin = () => {
  const cookie = useSession();
  if (!cookie)
    return () => {
      console.log("Logging in...");
      window.location.href = routes.auth.login() + "?redirectUrl=" + window.location.origin;
    };
  return () => {
    console.error("useLogin invoked while session state is valid.");
  };
};
