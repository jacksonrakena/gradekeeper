import { Browser } from "@capacitor/browser";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Heading, Img, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import themeConstants from "../../lib/theme/themeConstants";

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
              //signIn("google");
              (async () => {
                const host = "https://preview.gradekeeper.xyz";
                const { csrfToken }: { csrfToken: string } = await fetch(`${host}/api/auth/csrf`, {
                  credentials: "include",
                }).then((res) => {
                  return res.json();
                });

                // Generate an oAuth url for the Twitter provider
                const { url }: { url: string } = await fetch(`${host}/api/auth/signin/google`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: new URLSearchParams({
                    csrfToken,
                    json: "true",
                    // where next-auth will redirect us after auth
                    callbackUrl: `${host}/redirect`,
                  }),
                  redirect: "follow",
                  credentials: "include",
                }).then((res) => res.json());

                Browser.addListener("browserFinished", () => {
                  window.location.reload();
                });
                await Browser.open({ url: url });
              })();
            }}
            colorScheme={"brand"}
          >
            Get started <ArrowForwardIcon ml={2} />
          </Button>
          <Box p={8} style={{ borderRadius: 25 }} bgColor={useColorModeValue("white", themeConstants.darkModeContrastingColor)}>
            <Stack align="center">
              <Heading size="md" mb={4}>
                View all your classes
              </Heading>
              <Img src="https://i.imgur.com/PUxo2sF.jpg" />
            </Stack>
          </Box>
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
