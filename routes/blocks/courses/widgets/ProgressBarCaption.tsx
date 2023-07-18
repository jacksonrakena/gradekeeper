import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

const ProgressBarCaption = (props: PropsWithChildren<{ color: string; atProgressPercentage: number; position: "top" | "bottom" }>) => {
  const topStyling: any = {};
  if (props.position === "top") topStyling.bottom = "120%";
  if (props.position === "bottom") topStyling.top = "110%";
  return (
    <>
      <div
        style={{
          borderColor: props.color,
          position: "absolute",
          height: "99%",
          width: "1px",
          left: props.atProgressPercentage + "%",
        }}
        className="border border-black"
      >
        &nbsp;
      </div>
      <Box
        style={{
          position: "absolute",
          left: props.atProgressPercentage - 1 + "%",
          ...topStyling,
        }}
        className="text-xs md:text-base text-center"
        fontWeight={"semibold"}
      >
        {props.children}
      </Box>
    </>
  );
};

export default ProgressBarCaption;
