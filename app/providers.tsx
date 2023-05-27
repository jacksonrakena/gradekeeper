"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, useEffect } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { useInvalidator, UserState } from "../state/course";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <InvalidatorManager>
        <SessionProvider>
          <CacheProvider>
            <ChakraProvider>{children}</ChakraProvider>
          </CacheProvider>
        </SessionProvider>
      </InvalidatorManager>
    </RecoilRoot>
  );
}

export const InvalidatorManager = (props: PropsWithChildren) => {
  const { invalidate } = useInvalidator();
  const user = useRecoilValue(UserState);
  useEffect(() => {
    if (!user) invalidate();
  }, []);
  return <>{props.children}</>;
};
