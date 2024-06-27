import { GradeMap, ProcessedCourse } from "@/lib/logic/processing";
import { GpaTable, calculateAusWam, calculateGpaBasedOnTable } from "@/lib/logic/processing/gpa";
import { ProcessedUserState } from "@/lib/state/course";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  UseDisclosureReturn,
  VStack,
} from "@chakra-ui/react";
import Decimal from "decimal.js";
import { useAtomValue } from "jotai";
import { ProgressBarCaption } from "../course/widgets/projection/ProgressBarCaption";

export const NzGpaTable: GpaTable = {
  "A+": "9",
  A: "8",
  "A-": "7",
  "B+": "6",
  B: "5",
  "B-": "4",
  "C+": "3",
  C: "2",
  "C-": "1",
};
export const UsGpaTable: GpaTable = {
  "A+": "4",
  A: "4",
  "A-": "3.7",
  "B+": "3.3",
  B: "3",
  "B-": "2.7",
  "C+": "2.3",
  C: "2",
  "C-": "1.7",
};

interface NationGpa {
  name: string;
  usedIn: string;
  get: (
    courses: ProcessedCourse[],
    gradeMap: GradeMap
  ) => {
    heading: string;
    subheading?: string;
    progress: Decimal;
    points: { name: string; position: Decimal }[];
  };
}

const nationalities: NationGpa[] = [
  {
    name: "GPA",
    usedIn: "New Zealand",
    get: (courses, gm) => {
      const gpacalc = calculateGpaBasedOnTable(courses, NzGpaTable);
      return {
        heading: gpacalc.letter,
        subheading: gpacalc.value.toFixed(2) + " out of 9",
        progress: new Decimal(gpacalc.value).div(9),
        points: Object.entries(NzGpaTable).map(([label, number]) => ({
          name: label,
          position: new Decimal(number).div(9),
        })),
      };
    },
  },
  {
    name: "GPA",
    usedIn: "United States",
    get: (courses, gm) => {
      const gpacalc = calculateGpaBasedOnTable(courses, UsGpaTable);
      return {
        heading: gpacalc.letter,
        subheading: gpacalc.value.toFixed(2) + " out of 4",
        progress: gpacalc.value.div(4),
        points: Object.entries(UsGpaTable).map(([label, number]) => ({
          name: label,
          position: new Decimal(number).div(4),
        })),
      };
    },
  },
  {
    name: "Weighted Average Mark",
    usedIn: "Australia",
    get: (courses, gm) => {
      const gpacalc = calculateAusWam(courses, gm);
      const borders: { [x: string]: string } = {
        0.85: "High Distinction",
        0.75: "Distinction",
        0.65: "Credit",
        0.5: "Pass",
        0: "Fail",
      };
      const shortMap = {
        0.85: "HD",
        0.75: "D",
        0.65: "C",
        0.5: "P",
        0: "F",
      };
      const thresholds = Object.keys(borders);
      thresholds.sort();
      let threshold = new Decimal(0);
      for (const e of thresholds) {
        if (gpacalc.value.greaterThanOrEqualTo(e)) threshold = new Decimal(e);
      }
      return {
        heading: borders[threshold.toNumber().toString()],
        subheading: gpacalc.value.mul(100).toFixed(1),
        progress: gpacalc.value,
        points: Object.entries(shortMap).map(([number, label]) => ({ name: label, position: new Decimal(number) })),
      };
    },
  },
];

export const LifetimeGpaNationality = (props: { nationality: NationGpa; courses: ProcessedCourse[]; gradeMap: GradeMap }) => {
  const data = props.nationality.get(
    props.courses.filter((e) => !e.grades.projected.value.eq(0)),
    props.gradeMap
  );
  return (
    <GridItem w="100%">
      <VStack alignItems={"start"}>
        <Box>
          <Heading size="sm">{props.nationality.name}</Heading>
          <Heading size="xs" color="GrayText">
            {props.nationality.usedIn}
          </Heading>
        </Box>
        <Box>
          <Stat>
            <StatNumber>{data.heading}</StatNumber>
            <StatLabel>{data.subheading}</StatLabel>
          </Stat>
        </Box>
        <Box w="100%">
          <Box style={{ position: "relative", backgroundColor: "#D9D9D9", height: "30px" }} className="rounded flex grow">
            <div
              style={{
                position: "absolute",
                height: "30px",
                background: "grey",
                width: data.progress.mul(100) + "%",
              }}
              className="rounded"
            >
              &nbsp;
            </div>
            {data.points.map((point) => (
              <ProgressBarCaption
                key={point.name}
                atProgressPercentage={point.position.mul(100)}
                color="black"
                additionalClasses="text-sm"
                position="bottom"
              >
                {point.name}
              </ProgressBarCaption>
            ))}
          </Box>
        </Box>
      </VStack>
    </GridItem>
  );
};

export const LifetimeGpaModel = (props: { disclosure: UseDisclosureReturn }) => {
  const user = useAtomValue(ProcessedUserState);
  return (
    <>
      <Modal size="6xl" {...props.disclosure} preserveScrollBarGap={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"2xl"}>Your lifetime scores</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {user && (
              <>
                <Text>This feature is experimental. These values are provided as estimates only.</Text>
                <Grid mt={4} templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={12}>
                  {nationalities.map((n) => (
                    <LifetimeGpaNationality nationality={n} courses={user.studyBlocks.flatMap((e) => e.courses)} gradeMap={user.gradeMap} />
                  ))}
                  <Box m={4}></Box>
                </Grid>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
