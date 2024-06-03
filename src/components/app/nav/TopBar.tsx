import { Box, Flex } from "@chakra-ui/react";
import { ReactElement } from "react";
import { useSession } from "../../../lib/state/auth";
import AccountButton from "./AccountButton";

export const TopBar = (props: { leftWidget?: ReactElement }) => {
  const session = useSession();

  return (
    <Flex w={"full"} p={2}>
      <Box flexGrow={1}>{props.leftWidget}</Box>
      <Box>{session && <AccountButton />}</Box>
    </Flex>
  );
};
