"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, useEffect } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { UserState, useInvalidator } from "../lib/state/course";
import { Chakra } from "../lib/theme/Chakra";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <InvalidatorManager>
        <SessionProvider>
          <CacheProvider>
            <Chakra>{children}</Chakra>
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
