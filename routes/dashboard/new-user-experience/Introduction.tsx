import { Alert, AlertDescription, AlertIcon, Box, Button, Heading, UseDisclosureProps } from "@chakra-ui/react";

export const Introduction = (props: { createBlockDisclosure: UseDisclosureProps }) => {
  return (
    <div>
      <div>
        <Box mb={6}>
          <Heading as="h2" size="md">
            Welcome to Gradekeeper.
          </Heading>
          <Heading size="sm">Let&apos;s get you set up.</Heading>
        </Box>
        <Box mb={6}>
          Gradekeeper is organised around a system of &lsquo;study blocks&rsquo;, which can be trimesters, semesters, or terms, depending on
          your university.
        </Box>
        <Box mb={6}>
          <Alert>
            <AlertIcon />
            <AlertDescription>Let&apos;s start by making a study block.</AlertDescription>
          </Alert>
        </Box>
        <Button colorScheme="orange" size="sm" onClick={props.createBlockDisclosure.onOpen}>
          + New study block
        </Button>
      </div>
    </div>
  );
};
