"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, useEffect } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { UserState, useInvalidator } from "../lib/state/course";
import { ThemeState } from "../lib/state/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <InvalidatorManager>
        <SessionProvider>
          <Chakra>{children}</Chakra>
        </SessionProvider>
      </InvalidatorManager>
    </RecoilRoot>
  );
}

function Chakra({ children }: { children: React.ReactNode }) {
  const theme = useRecoilValue(ThemeState);
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

export const InvalidatorManager = (props: PropsWithChildren) => {
  const { invalidate } = useInvalidator();
  const user = useRecoilValue(UserState);
  useEffect(() => {
    if (!user) invalidate();
  }, []);
  return <>{props.children}</>;
};
