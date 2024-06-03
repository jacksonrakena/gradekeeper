import { Chakra } from "@/lib/theme";
import { Box, Link as CLink, Heading, SlideFade, Text, VStack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { Link, createBrowserRouter } from "react-router-dom";
import { useSession } from "./lib/state/auth";
import { UserState, useInvalidator } from "./lib/state/course";
import { Index } from "./routes";
import Account from "./routes/account";
import CourseView from "./routes/blocks/courses/CourseView";
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
  {
    path: "*",
    element: (
      <Box my={"20"}>
        <VStack>
          <Heading size="md">Page not found.</Heading>
          <Text>
            Would you like to{" "}
            <CLink color="teal.700">
              <Link to="/">go back home?</Link>
            </CLink>
          </Text>
        </VStack>
      </Box>
    ),
  },
]);
