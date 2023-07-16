"use client";
import { SlideFade } from "@chakra-ui/react";
import React, { PropsWithChildren, useEffect } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { Chakra } from "../lib/theme/Chakra";
import { useInvalidator, UserState } from "../state/course";
import "../styles/globals.css";

function GradekeeperAppRoot({ Component, pageProps: { session, ...pageProps }, router }: AppProps<any>) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <RecoilRoot>
        <React.Fragment>
          <AuthContextProvider>
            <InvalidatorManager>
              <SessionProvider session={session}>
                <Chakra cookies={pageProps.cookies}>
                  <SlideFade key={router.route} in={true}>
                    <Component {...pageProps} />
                  </SlideFade>
                </Chakra>
              </SessionProvider>
            </InvalidatorManager>
          </AuthContextProvider>
        </React.Fragment>
      </RecoilRoot>
    </>
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

export default GradekeeperAppRoot;
