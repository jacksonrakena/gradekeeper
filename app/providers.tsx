"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { InvalidatorManager } from "../pages/_app";

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
