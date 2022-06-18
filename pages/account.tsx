import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Code, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { TopBar } from "../components/TopBar";

const Account: NextPage = () => {
  const data = useSession();
  return (
    <>
      <Head>
        <title>My account</title>
      </Head>
      <TopBar />
      <Box paddingX={12}>
        <Heading paddingBottom={6}>My account</Heading>
        <Stack spacing={12}>
          <Box>
            <Heading size="md">{data.data?.user?.name}</Heading>
            <Text>
              Connected to your Google account: <Code>{data.data?.user?.email}</Code>
            </Text>
          </Box>
        </Stack>
        <Box mt={12}>
          <Text>Gradekeeper is &copy; 2022 Animals With Cool Hats, Inc.</Text>
          <Text>Gradekeeper is powered by open-source software.</Text>
          <Text>
            Gradekeeper is{" "}
            <Link color="teal.500" href="https://github.com/jacksonrakena/gradekeeper" isExternal>
              open-source <ExternalLinkIcon mx="2px" />
            </Link>
            .
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default Account;
