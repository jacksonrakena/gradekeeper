import React, { useContext } from "react";

export interface UserCookie {
  exp: number;
  iat: number;
  id: string;
  name: string;
  picture: string;
}
export interface AuthStateContext {
  cookie: UserCookie | null;
  loggedIn: boolean;
  logOut: () => void;
  logIn: () => void;
}
const AuthContext = React.createContext<AuthStateContext>({
  cookie: null,
  loggedIn: false,
  logOut: () => {},
  logIn: () => {},
});
const AuthContextProvider = AuthContext.Provider;

export default AuthContextProvider;

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  return authContext;
};
