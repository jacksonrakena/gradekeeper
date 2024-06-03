import { Box, Link as CLink, Code, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouteError } from "react-router";
import { Link } from "react-router-dom";

export const ErrorGeneral = () => {
  const error: any = useRouteError();
  console.error(error);

  return (
    <Box my={"20"}>
      <VStack>
        <Heading size="md">There was an unexpected error.</Heading>
        <Text>
          <Code>{error.statusText || error.message}</Code>
        </Text>
        <Text>
          Please report to{" "}
          <a href="mailto:jackson@rakena.co.nz">
            <CLink color="teal.700">jackson@rakena.co.nz</CLink>
          </a>
          .
        </Text>
        <Text>
          Would you like to{" "}
          <CLink color="teal.700">
            <Link to="/">go back home?</Link>
          </CLink>
        </Text>
      </VStack>
    </Box>
  );
};
