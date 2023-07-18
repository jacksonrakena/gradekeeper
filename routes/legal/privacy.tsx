import { Box, Code, Heading, Link, Stack, Text } from "@chakra-ui/react";

import { PropsWithChildren } from "react";

const PrivacySubheading = (props: PropsWithChildren) => {
  return <Heading size="md">{props.children}</Heading>;
};

const PrivacyPolicy = () => {
  return (
    <Box m={12}>
      <Stack spacing={8}>
        <Stack spacing={2}>
          <Heading>Privacy policy</Heading>
          <Text size={"sm"}>Last updated: June 20th, 2022</Text>
        </Stack>
        <Box>
          <Stack spacing={8}>
            <Box>
              <PrivacySubheading>Introduction &amp; definitions</PrivacySubheading>
              Gradekeeper believes in the user's fundamental right to privacy.
              <br />
              <br />
              For the purposes of this document, 'we' or 'us', refers to Animals With Cool Hats, Inc. (<Code>NZBN 9429048922678</Code>), a
              registered business in New Zealand. <br />
              'Gradekeeper' refers to Gradekeeper, an Internet service provided by us. <br />
            </Box>
            <Box>
              <PrivacySubheading>Jurisdiction of operation and data</PrivacySubheading>
              Gradekeeper is a product of Animals With Cool Hats, Inc. (<Code>NZBN 9429048922678</Code>), a registered sole trader business
              in New Zealand.
              <br />
              <br />
              User data can be processed in either Washington, D.C., United States, or Sydney, Australia by Gradekeeper's third-party
              infrastructure provider, <Link href="https://vercel.com">Vercel</Link>.<br />
              User data is persisted and stored in Sydney, Australia, by third-party data provider{" "}
              <Link href="https://planetscale.com/">PlanetScale</Link>.
            </Box>
            <Box>
              <PrivacySubheading>Usage of user data</PrivacySubheading>A user's login provider identifier (i.e. a Google email, GitHub
              username, or Twitter name) is used to identify the user in Gradekeeper's systems, and persist data between sessions.
              <br />
              <br />
              If a user has an email attached to their account login, Gradekeeper may send them Critical Service Notifications (CSNs) in
              case of a serious concern or risk with their account or data. Gradekeeper will not use your email address for any other
              purpose.
            </Box>
            <Box>
              <PrivacySubheading>Collection of user data</PrivacySubheading>A user's Google identifier is collected and stored in
              Gradekeeper's systems for the purpose of identifying the user and their data. The user's Google name and profile picture are
              received from Google and presented to show the user their identity, but this data is not persisted in Gradekeeper's systems.
            </Box>
            <Box>
              <PrivacySubheading>Advertising</PrivacySubheading>
              In order to pay for infrastructure, marketing, and service costs, Gradekeeper may present advertisements through{" "}
              <b>Google AdSense</b> on the Gradekeeper website. Gradekeeper does not intentionally share user information with Google
              AdSense to target advertisements, and does not sell user information to advertising-related third parties.
            </Box>
            <Box>
              <PrivacySubheading>Access to data by third-parties</PrivacySubheading>
              As of June 20th, 2022, Gradekeeper does not share user data with third-parties.
            </Box>
            <Box>
              <PrivacySubheading>The right to be forgotten</PrivacySubheading>
              Gradekeeper does not currently have an automated service to delete user information. Users can delete all account data stored
              by Gradekeeper by emailing <Code>support@animalswithcoolhats.com</Code> with <Code>DATA: Delete my Gradekeeper data</Code> in
              the subject.
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default PrivacyPolicy;
