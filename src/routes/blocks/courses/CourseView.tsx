import { preferenceColor } from "@/lib/colors";
import { DeleteIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Spinner,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  VStack,
  useClipboard,
  useColorModeValue,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import Decimal from "decimal.js";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Footer from "../../../components/app/Footer";
import CourseSwitcher from "../../../components/app/nav/CourseSwitcher";
import { TopBar } from "../../../components/app/nav/TopBar";
import { Editable } from "../../../components/generic/Editable";
import { ProcessedCourse, ProcessedStudyBlock, ProcessedUser, adjust } from "../../../lib/logic/processing";
import { Course } from "../../../lib/logic/types";
import { routes, useApi } from "../../../lib/net/fetch";
import { SessionState, getTicket } from "../../../lib/state/auth";
import { ProcessedUserState, useInvalidator } from "../../../lib/state/course";
import themeConstants from "../../../lib/theme";
import { DeleteCourseDialog } from "./DeleteCourseDialog";
import AveragesWidget from "./widgets/AveragesWidget";
import CourseCompletedWidget from "./widgets/CourseCompletedWidget";
import ProgressBarCaption from "./widgets/ProgressBarCaption";
import { ResultsWidget } from "./widgets/components/ResultsWidget";

const CourseView = () => {
  const cookie = useAtomValue(SessionState);
  const navigate = useNavigate();
  const user = useAtomValue(ProcessedUserState);
  const { course_id, block_id } = useParams();
  const studyBlock = user?.studyBlocks.find((e) => e.id === block_id);
  const course = studyBlock?.courses.find((a) => a.id === course_id);

  useEffect(() => {
    if (!getTicket()) navigate("/");
  }, [cookie, navigate, user, studyBlock]);

  if (!user || !course || !studyBlock) return <CourseLoading />;

  return <CourseViewInner user={user} course={course} studyBlock={studyBlock} />;
};

const CourseLoading = () => {
  return (
    <Box my={"20"}>
      <VStack>
        <Spinner />
        <Heading size="md">Loading...</Heading>
      </VStack>
    </Box>
  );
};

const CourseViewInner = ({
  user,
  course,
  studyBlock,
}: {
  user: ProcessedUser;
  course: ProcessedCourse;
  studyBlock: ProcessedStudyBlock;
}) => {
  const gradeMap = user?.gradeMap;
  const fetcher = useApi();

  const cb = useClipboard(course.id || "");
  const captionColor = useColorModeValue("gray.700", "gray.200");
  const deletionDisclosure = useDisclosure();

  const contrastingColor = useColorModeValue("white", themeConstants.darkModeContrastingColor);
  const tooltipColor = useColorModeValue("white", "black");
  const { updateCourse } = useInvalidator();
  console.log(course);
  const theme = useTheme();
  return (
    <div>
      <DeleteCourseDialog course={course} disclosure={deletionDisclosure} />
      <TopBar leftWidget={<CourseSwitcher currentCourse={course} currentStudyBlock={studyBlock} />} />
      <>
        <Box
          bgColor={course?.color}
          color={preferenceColor(course?.color, theme.colors.brand["900"], theme.colors.brand["100"])}
          className="p-8"
        >
          <Flex className="text-3xl">
            <Box display="inline" className="mr-4">
              <Editable
                displayProps={{ fontWeight: "semibold" }}
                onSubmit={async (n) => {
                  const data = await fetcher.post<Course>(routes.block(studyBlock.id).course(course.id).update(), { courseCodeName: n });
                  if (data) {
                    updateCourse(data.id, (e) => data);
                  }
                }}
                backingValue={course.courseCodeName}
              />
              {course.courseCodeName && " "}
              <Editable
                displayProps={{ fontWeight: "semibold" }}
                onSubmit={async (n) => {
                  const data = await fetcher.post<Course>(routes.block(studyBlock.id).course(course.id).update(), { courseCodeNumber: n });
                  if (data) {
                    updateCourse(data.id, (e) => data);
                  }
                }}
                backingValue={course.courseCodeNumber}
              />
            </Box>

            <Editable
              onSubmit={async (n) => {
                const data = await fetcher.post<Course>(routes.block(studyBlock.id).course(course.id).update(), { longName: n });
                if (data) {
                  updateCourse(data.id, (e) => data);
                }
              }}
              backingValue={course.longName}
            />
          </Flex>
          <Box className="text-xl">
            <HStack spacing={10} className="mr-4">
              <Text>{studyBlock?.name}</Text>

              <HStack>
                <IconButton
                  onClick={() => {
                    deletionDisclosure.onOpen();
                  }}
                  icon={<DeleteIcon />}
                  size="xs"
                  aria-label={"Delete"}
                  colorScheme="brand"
                />
                <Button size="xs" onClick={cb.onCopy} colorScheme="brand" disabled={cb.hasCopied}>
                  {cb.hasCopied ? "Copied" : "Copy share code"}
                </Button>
              </HStack>
            </HStack>
          </Box>
        </Box>

        {course.status.isCompleted && (
          <div className="p-6 m-4 shadow-md rounded-md" style={{ backgroundColor: contrastingColor }}>
            <CourseCompletedWidget course={course} />
          </div>
        )}

        <div className="flex flex-wrap">
          <ResultsWidget contrastingColor={contrastingColor} course={course} />

          {!course.status.isCompleted && <AveragesWidget course={course} />}
        </div>

        {!course.status.isCompleted && (
          <div className="p-6 m-4 shadow-md rounded-md" style={{ backgroundColor: contrastingColor }}>
            <div className="">
              <>
                <div className="lg:flex">
                  <Stat className="basis-1/4" style={{ WebkitFlex: "0 !important" }}>
                    <StatLabel fontSize="lg">Projected grade</StatLabel>
                    {course.grades.projected.value.eq(0) && (
                      <>
                        <StatNumber>No data</StatNumber>
                      </>
                    )}
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
                      {Object.keys(gradeMap ?? {})
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
                              {(gradeMap ?? {})[gradeNumber]}
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
                            "Lowest possible grade: " +
                            course.grades.actual?.letter +
                            " (" +
                            course.grades.actual?.value.mul(100).toPrecision(3) +
                            "%)"
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
              </>
            </div>
          </div>
        )}
        <Box px={8} py={2}>
          <Footer />
        </Box>
      </>
    </div>
  );
};

export default CourseView;
