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
          <Text size={"sm"}>Last updated: June 23rd, 2024</Text>
        </Stack>
        <Box>
          <Stack spacing={8}>
            <Box>
              <PrivacySubheading>Introduction &amp; definitions</PrivacySubheading>
              Gradekeeper believes in the user's fundamental right to privacy.
              <br />
              <br />
              For the purposes of this document, 'we' or 'us', refers to Rakena Investment Corporation (<Code>NZBN 9429048922678</Code>), a
              registered business in Australia and New Zealand. <br />
              'Gradekeeper' refers to Gradekeeper, an Internet service provided by us. <br />
              'You' refers to any person who elects to use the Gradekeeper service by authorising their login with Google or any other
              third-party identity provider.
            </Box>
            <Box>
              <PrivacySubheading>Jurisdiction of operation and data</PrivacySubheading>
              Gradekeeper is a product offered by Rakena Investment Corporation (<Code>NZBN 9429048922678</Code>), a registered business in
              Australia and New Zealand.
              <br />
              <br />
              User data is processed, persisted, and stored in Melbourne, Australia by Gradekeeper's third party infrastructure partner{" "}
              <Link href="https://www.oracle.com/au/">Oracle Australia</Link>.
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
              As of June 23rd, 2024, Gradekeeper does not share user data with third-parties.
            </Box>
            <Box>
              <PrivacySubheading>The right to be forgotten</PrivacySubheading>
              You can delete all account data stored by Gradekeeper (including, but not limited to: <strong>(a)</strong> information
              relating to courses, <strong>(b)</strong> analytics regarding your usage of Gradekeeper, <strong>(c)</strong> information
              regarding your selected grade boundaries) by selecting the 'Delete my data' option on the Settings page.
              <br />
              <br />
              Account deletions are immediate, final, and irreversible.
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default PrivacyPolicy;
