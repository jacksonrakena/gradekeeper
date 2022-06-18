import { SlideFade } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { Chakra } from "../Chakra";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps }, router }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Chakra cookies={pageProps.cookies}>
        <SlideFade key={router.route} in={true}>
          <Component {...pageProps} />
        </SlideFade>
      </Chakra>
    </SessionProvider>
  );
}

export default MyApp;
