import { Box, Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box color={"GrayText"} fontSize={"sm"}>
      &copy; Jackson Rakena <br />
      <Link href="https://github.com/jacksonrakena/gradekeeper/issues">Support</Link> &bull; <Link href="/legal/privacy">Privacy</Link>
    </Box>
  );
};

export default Footer;
