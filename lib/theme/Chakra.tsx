// e.g. src/Chakra.js
// a) import `ChakraProvider` component as well as the storageManagers
import { ChakraProvider } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { ThemeState } from "../../state/theme";

// @ts-ignore
export function Chakra({ cookies, children }) {
  const theme = useRecoilValue(ThemeState);
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
