import { Box } from "@chakra-ui/react";
import Decimal from "decimal.js";
import { PropsWithChildren } from "react";

export const ProgressBarCaption = (
  props: PropsWithChildren<{ color: string; atProgressPercentage: Decimal; position: "top" | "bottom"; additionalClasses?: string }>
) => {
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
          left: props.atProgressPercentage.minus(1).toString() + "%",
          ...topStyling,
        }}
        className={`${!props.additionalClasses && "text-xs md:text-base"} ${props.additionalClasses} text-center`}
        fontWeight={"semibold"}
      >
        {props.children}
      </Box>
    </>
  );
};
