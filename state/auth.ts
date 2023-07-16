"use client";
import jwtDecode from "jwt-decode";
import React, { useContext } from "react";

const AuthContext = React.createContext({
    cookie: null,
    loggedIn: false
});
const AuthContextProvider = AuthContext.Provider;

export default AuthContextProvider;
const getCookie = (key: string) => {
  var b = window.document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
};

export const useAuth = () => {
  console.log("using auth");
  const authContext = useContext(AuthContext);
  const cookie = getCookie("GK_COOKIE");
  console.log("cookie: ", cookie);
  const d = jwtDecode(cookie);
  console.log(d);
  if (d && d.exp && d.exp > Date.now() / 1000) {
    console.log("valid");
  }

  return authContext;
};
