// @ts-nocheck
import { Box, Button, Heading, Text } from "@chakra-ui/react";

const Donations = () => {
  return (
    <Box m={12}>
      <Heading mb={4}>Help support Gradekeeper</Heading>
      <Text maxW={"80%"}>
        Gradekeeper is, and will always be, free for all students to use, but Gradekeeper costs money to operate, including server costs,
        infrastructure costs, and expensive licenses.
        <br />
        <br />
        Your contribution means a lot to us.
        <br />
        <br />
        <Button
          colorScheme={"green"}
          onClick={() => {
            window.open("https://ko-fi.com/jacksonrakena59962");
          }}
        >
          Donate with Ko-fi
        </Button>
      </Text>
    </Box>
  );
};

export default Donations;
