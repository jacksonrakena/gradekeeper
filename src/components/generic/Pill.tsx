import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import themeConstants from "../../lib/theme";

export const Pill = (
  props: PropsWithChildren<{
    boxProps?: Partial<BoxProps>;
  }>
) => {
  return (
    <Box
      my={4}
      className="shadow-md hover:cursor-pointer"
      style={{
        padding: "10px",
        paddingLeft: "25px",
        borderRadius: "0.7rem",
        maxWidth: "800px",
        display: "block",
        backgroundColor: useColorModeValue("#fff", themeConstants.darkModeContrastingColor),
        transition: "0.25s",
        WebkitFilter: "blur(0)",
        msFilter: "blur(0)",
        filter: "none",
      }}
      _hover={{
        transform: "scale(1.01)",
      }}
      {...props.boxProps}
    >
      {props.children}
    </Box>
  );
};
