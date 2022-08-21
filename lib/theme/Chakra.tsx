// e.g. src/Chakra.js
// a) import `ChakraProvider` component as well as the storageManagers
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";

// @ts-ignore
export function Chakra({ cookies, children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
