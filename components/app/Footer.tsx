import { Box, Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box color={"GrayText"} fontSize={"sm"}>
      &copy; Animals With Cool Hats, Inc. <br />
      <Link href="/legal/privacy">Privacy</Link> &bull; <Link href="https://forms.office.com/r/rM3wq1QbH0">Feedback</Link> &bull;{" "}
      <Link href="/legal/donate">Donate</Link>
    </Box>
  );
};

export default Footer;
