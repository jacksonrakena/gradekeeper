import { SlideFade } from "@chakra-ui/react";
import jwtDecode from "jwt-decode";
import React, { PropsWithChildren, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import Account from "../routes/account";
import { App } from "../routes/app";
import CourseView from "../routes/blocks/courses/CourseView";
import Donations from "../routes/legal/donate";
import CompletedDonation from "../routes/legal/donate/completed";
import PrivacyPolicy from "../routes/legal/privacy";
import "../styles/globals.css";
import AuthContextProvider, { AuthStateContext, UserCookie } from "./lib/state/auth";
import { useInvalidator, UserState } from "./lib/state/course";
import { Chakra } from "./lib/theme/Chakra";

export const InvalidatorManager = (props: PropsWithChildren) => {
  const { invalidate } = useInvalidator();
  const user = useRecoilValue(UserState);
  useEffect(() => {
    if (!user) invalidate();
  }, []);
  return <>{props.children}</>;
};

const getCookie = (key: string) => {
  var b = window.document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
};
const Root = () => {
  const [authContext, setAuthContext] = useState<AuthStateContext>({
    cookie: null,
    loggedIn: false,
    logIn: () => {
      window.location.href = "/api/auth/login";
    },
    logOut: () => {
      window.document.cookie = "GK_COOKIE=;expires=Thu, 01-Jan-1970 00:00:01 GMT;";
      setAuthContext((c) => {
        return { ...c, loggedIn: false, cookie: null };
      });
    },
  });
  const cookie = getCookie("GK_COOKIE");
  useEffect(() => {
    if (authContext.loggedIn && authContext.cookie) {
      if (authContext.cookie?.exp <= Date.now() / 1000) {
        console.log("cookie expired, resetting");
        setAuthContext((c) => ({ ...c, cookie: null, loggedIn: false }));
      }
    }
    if (!authContext.loggedIn) {
      try {
        if (cookie) {
          const d: UserCookie = jwtDecode(cookie);
          console.log("Decoded cookie:", d);
          if (d && d.exp && d.exp > Date.now() / 1000) {
            console.log("valid");
            setAuthContext((c) => ({ ...c, cookie: d, loggedIn: true }));
          }
        } else {
          console.log("no cookie");
        }
      } catch (e) {
        console.log("failed to decode jwt", e);
      }
    }
  }, [cookie, authContext.loggedIn]);
  return (
    <RecoilRoot>
      <AuthContextProvider value={authContext}>
        <InvalidatorManager>
          <Chakra>
            <SlideFade in={true}>
              <RouterProvider router={router} />
            </SlideFade>
          </Chakra>
        </InvalidatorManager>
      </AuthContextProvider>
    </RecoilRoot>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "blocks/:block_id/courses/:course_id",
    element: <CourseView />,
  },
  {
    path: "/legal/donate",
    element: <Donations />,
  },
  {
    path: "/legal/donate/completed",
    element: <CompletedDonation />,
  },
  {
    path: "/legal/privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/account",
    element: <Account />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
