import { SlideFade } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { PropsWithChildren, useEffect } from "react";
import { RecoilRoot } from "recoil";
import { Chakra } from "../lib/theme/Chakra";
import { useInvalidator } from "../state/course";
import "../styles/globals.css";

function GradekeeperAppRoot({ Component, pageProps: { session, ...pageProps }, router }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <RecoilRoot>
        <InvalidatorManager>
          <SessionProvider session={session}>
            <Chakra cookies={pageProps.cookies}>
              <SlideFade key={router.route} in={true}>
                <Component {...pageProps} />
              </SlideFade>
            </Chakra>
          </SessionProvider>
        </InvalidatorManager>
      </RecoilRoot>
    </>
  );
}

const InvalidatorManager = (props: PropsWithChildren) => {
  const { invalidate } = useInvalidator();
  useEffect(() => {
    invalidate();
  }, []);
  return <>{props.children}</>;
};

export default GradekeeperAppRoot;
