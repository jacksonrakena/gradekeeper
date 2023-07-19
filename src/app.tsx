import { SlideFade } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Account from "../routes/account";
import { App } from "../routes/app";
import CourseView from "../routes/blocks/courses/CourseView";
import Donations from "../routes/legal/donate";
import CompletedDonation from "../routes/legal/donate/completed";
import PrivacyPolicy from "../routes/legal/privacy";
import { AuthState } from "./lib/state/auth";
import { useInvalidator, UserState } from "./lib/state/course";
import { Chakra } from "./lib/theme/Chakra";

export const AppRoot = () => {
  const auth = useRecoilValue(AuthState);
  const user = useRecoilValue(UserState);
  const invalidator = useInvalidator();
  useEffect(() => {
    if (auth.loggedIn && !user) {
      invalidator.invalidate();
    }
  }, [auth.loggedIn, invalidator, user]);

  return (
    <Chakra>
      <SlideFade in={true}>
        <RouterProvider router={router} />
      </SlideFade>
    </Chakra>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/blocks/:block_id/courses/:course_id",
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
