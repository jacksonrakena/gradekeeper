import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { Chakra } from "../Chakra";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Chakra cookies={pageProps.cookies}>
        <Component {...pageProps} />
      </Chakra>
    </SessionProvider>
  );
}

export default MyApp;
