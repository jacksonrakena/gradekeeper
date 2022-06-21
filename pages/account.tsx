import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, Code, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { TopBar } from "../components/TopBar";
import { useUserContext } from "../UserContext";

const Account: NextPage = () => {
  const data = useSession();
  const user = useUserContext();
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
        <Box mt={8}>
          <Heading size="md">Download my data</Heading>
          <Text>Gradekeeper believes in the right to privacy. Click the button below to download a copy of your data:</Text>
          <Button
            as={"a"}
            mt={2}
            colorScheme={"red"}
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify({
                meta: {
                  created: new Date().getTime(),
                  service: "AWCH_GK_PUBLIC_VCL",
                  server: "SYD02.SECURE.GRADEKEEPER.XYZ",
                },
                data: user?.user,
              })
            )}`}
            download={`GK_EXPORT_${new Date().getTime()}.json`}
          >
            Download my data
          </Button>
        </Box>
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
