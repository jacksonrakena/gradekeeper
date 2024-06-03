import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Heading, Img, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../lib/state/auth";
import themeConstants from "../lib/theme";

const MarketingBox = (props: { heading: string; img: string }) => {
  return (
    <Box p={8} style={{ borderRadius: 25 }} bgColor={useColorModeValue("white", themeConstants.darkModeContrastingColor)}>
      <Stack align="center">
        <Heading size="md" mb={4}>
          {props.heading}
        </Heading>
        <Img src={props.img} />
      </Stack>
    </Box>
  );
};

const MarketingHome = () => {
  const [loadingApp, setLoadingApp] = useState(false);
  const auth = useAuth();
  return (
    <div className="m-12">
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
              auth.logIn();
            }}
            colorScheme={"brand"}
          >
            Get started <ArrowForwardIcon ml={2} />
          </Button>
          <MarketingBox heading="View all your classes" img="https://i.imgur.com/PUxo2sF.jpg" />
          <MarketingBox heading="See your 🇺🇸 and 🇳🇿 GPA" img="https://i.imgur.com/feaGmRS.png" />
          <MarketingBox heading="See what you need to get the grades you deserve" img="https://i.imgur.com/iq8JuKs.png" />
        </Stack>
        <Text color="#555555" textAlign={"center"} fontSize="sm">
          &copy; 2022&mdash;2024 Jackson Rakena <br />
        </Text>
      </Container>
    </div>
  );
};

export default MarketingHome;
