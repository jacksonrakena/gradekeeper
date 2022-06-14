import { Box, Button, Code, Container, Heading, Stack, Text } from "@chakra-ui/react";
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
      </Box>
    </>
  );
};

export default Account;
