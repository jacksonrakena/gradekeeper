import { Box, Link as CLink, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const Error404 = () => {
  return (
    <Box my={"20"}>
      <VStack>
        <Heading size="md">Page not found.</Heading>
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
