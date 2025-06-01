import { Box, Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box color={"GrayText"} fontSize={"sm"}>
      &copy; Jackson Rakena <br />
      <Link href="https://discord.gg/jpgrtS6UsV">Join our Discord for support</Link> &bull;{" "}
      <Link href="/legal/privacy">Privacy</Link> &bull; <Link href="/legal/donate">Donate</Link>
    </Box>
  );
};

export default Footer;
