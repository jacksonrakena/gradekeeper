import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

const MarketingHome = () => {
  const [loadingApp, setLoadingApp] = useState(false);
  return (
    <div className="m-12">
      <Head>
        <title>Gradekeeper</title>
      </Head>
      <Container>
        <Stack mb={12} spacing={8}>
          <Heading size="4xl">
            <Text as={"span"} size="4xl" bgClip="text" bgGradient="linear(to-r, green.200, pink.500)">
              Stay ahead
            </Text>
            <br />
            of your grades
          </Heading>
          <Text fontSize="2xl">The (other) only free app built by students to simplify grade tracking</Text>
          <Button
            isLoading={loadingApp}
            onClick={() => {
              setLoadingApp(true);
              signIn("google");
            }}
            colorScheme={"teal"}
          >
            Get started <ArrowForwardIcon ml={2} />
          </Button>
        </Stack>
        <Text color="#555555" textAlign={"center"} fontSize="sm">
          Copyright &copy; 2022 Jackson Rakena <br />
          This is beta software. <br />
        </Text>
      </Container>
    </div>
  );
};

export default MarketingHome;
