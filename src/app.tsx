import { Chakra } from "@/lib/theme";
import { SlideFade } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { useSession } from "./lib/state/auth";
import { UserState, useInvalidator } from "./lib/state/course";
import { Index } from "./routes";
import Account from "./routes/account";
import CourseView from "./routes/blocks/courses/CourseView";
import { Error404 } from "./routes/errors.404";
import { ErrorGeneral } from "./routes/errors.general";
import Donations from "./routes/legal/donate";
import CompletedDonation from "./routes/legal/donate/completed";
import PrivacyPolicy from "./routes/legal/privacy";

export const AppRoot = () => {
  const state = useSession();
  const user = useAtomValue(UserState);
  const invalidator = useInvalidator();
  useEffect(() => {
    if (state && !user) {
      invalidator.invalidate();
    }
  }, [state, invalidator, user]);

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
    element: <Index />,
    errorElement: <ErrorGeneral />,
  },
  {
    path: "/blocks/:block_id/courses/:course_id",
    element: <CourseView />,
    errorElement: <ErrorGeneral />,
  },
  {
    path: "/legal/donate",
    element: <Donations />,
    errorElement: <ErrorGeneral />,
  },
  {
    path: "/legal/donate/completed",
    element: <CompletedDonation />,
    errorElement: <ErrorGeneral />,
  },
  {
    path: "/legal/privacy",
    element: <PrivacyPolicy />,
    errorElement: <ErrorGeneral />,
  },
  {
    path: "/account",
    element: <Account />,
    errorElement: <ErrorGeneral />,
  },
  {
    path: "*",
    element: <Error404 />,
    errorElement: <ErrorGeneral />,
  },
]);
