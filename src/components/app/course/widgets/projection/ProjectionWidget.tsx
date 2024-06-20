import { ProcessedCourse, adjust } from "@/lib/logic/processing";
import { ProcessedUserState } from "@/lib/state/course";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Stat, StatHelpText, StatLabel, StatNumber, Text, Tooltip, useColorModeValue } from "@chakra-ui/react";
import Decimal from "decimal.js";
import { useAtomValue } from "jotai";
import { ProgressBarCaption } from "./ProgressBarCaption";

export const ProjectionWidget = ({ course }: { course: ProcessedCourse }) => {
  const tooltipColor = useColorModeValue("white", "black");
  const user = useAtomValue(ProcessedUserState);
  const captionColor = useColorModeValue("gray.700", "gray.200");
  return (
    <div className="lg:flex">
      <Stat className="basis-1/4" style={{ WebkitFlex: "0 !important" }}>
        <StatLabel fontSize="lg">Projected grade</StatLabel>
        {course.grades.projected.value.eq(0) && <StatNumber>No data</StatNumber>}
        {!course.grades.projected.value.eq(0) && (
          <>
            <StatNumber>{course.grades.projected?.letter}</StatNumber>
            <StatHelpText>{(course.grades.projected?.value ?? new Decimal(0)).mul(100).toPrecision(4)}%</StatHelpText>
          </>
        )}
      </Stat>
      <div className="py-3 flex grow mb-6">
        <div style={{ position: "relative", backgroundColor: "#D9D9D9", height: "30px" }} className="rounded flex grow">
          <div
            style={{
              position: "absolute",
              height: "30px",
              background: `repeating-linear-gradient(45deg, ${adjust(course?.color ?? "", -20)}, ${adjust(
                course?.color ?? "",
                -20
              )} 10px, ${adjust(course?.color ?? "", -40)} 10px, ${adjust(course?.color ?? "", -40)} 20px)`,
              width: course.grades.actual?.value.mul(100) + "%",
            }}
            className="rounded"
          >
            &nbsp;
          </div>
          <div
            style={{
              position: "absolute",
              height: "30px",
              background: `repeating-linear-gradient(45deg,grey, grey 10px, white 10px, white 20px)`,
              right: "0px",
              width: new Decimal(100).minus(course.grades.maximum?.value.mul(100)).toString() + "%",
            }}
            className="rounded"
          >
            &nbsp;
          </div>
          <div
            style={{
              backgroundColor: course?.color ?? "",
              width: "" + course.grades.projected?.value.mul(100) + "%",
            }}
            className="rounded"
          >
            &nbsp;
          </div>
          {Object.keys(user?.gradeMap ?? {})
            .map((e) => Number.parseFloat(e))
            .map((gradeNumber) => (
              <ProgressBarCaption
                key={gradeNumber}
                color={adjust(course?.color ?? "", -50)}
                atProgressPercentage={new Decimal(gradeNumber).mul(100)}
                position="bottom"
              >
                <Text color={captionColor}>
                  {(gradeNumber * 100).toFixed(0)} <br />
                  {(user?.gradeMap ?? {})[gradeNumber]}
                </Text>
              </ProgressBarCaption>
            ))}
          <ProgressBarCaption
            color={adjust(course?.color ?? "", -40)}
            atProgressPercentage={course.grades.actual?.value.mul(100)}
            position="top"
          >
            <Tooltip
              color={tooltipColor}
              label={
                "Lowest possible grade: " + course.grades.actual?.letter + " (" + course.grades.actual?.value.mul(100).toPrecision(3) + "%)"
              }
            >
              <InfoOutlineIcon w={4} h={4} />
            </Tooltip>
          </ProgressBarCaption>
          <ProgressBarCaption color={"grey"} atProgressPercentage={course.grades.maximum?.value.mul(100)} position="top">
            <Tooltip
              color={tooltipColor}
              label={
                "Maximum possible grade: " +
                course.grades.maximum?.letter +
                " (" +
                course.grades.maximum?.value.mul(100).toPrecision(3) +
                "%)"
              }
            >
              <InfoOutlineIcon w={4} h={4} />
            </Tooltip>
          </ProgressBarCaption>
        </div>
      </div>
    </div>
  );
};
