import { Box, Heading, Spinner, VStack } from "@chakra-ui/react";

export const GenericLoading = () => {
  return (
    <Box my={"20"}>
      <VStack>
        <Spinner />
        <Heading size="md">Loading...</Heading>
      </VStack>
    </Box>
  );
};
