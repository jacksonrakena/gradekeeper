import { DeleteIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  IconButton,
  Spinner,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useClipboard,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { ProcessedCourseInfo, ProcessedStudyBlock, adjust } from "../../../lib/logic/processing";
import { ProcessedUserState, useInvalidator } from "../../../lib/state/course";
import themeConstants from "../../../lib/theme/themeConstants";
import { GkEditable } from "../../generic/GkEditable";
import Footer from "../Footer";
import { TopBar } from "../nav/TopBar";
import AveragesWidget from "./widgets/AveragesWidget";
import CourseCompletedWidget from "./widgets/CourseCompletedWidget";
import ProgressBarCaption from "./widgets/ProgressBarCaption";
import { ResultsWidget } from "./widgets/components/ResultsWidget";

const CourseView = (
  props: PropsWithChildren<{
    course: ProcessedCourseInfo;
    studyBlock: ProcessedStudyBlock;
  }>
) => {
  const user = useRecoilValue(ProcessedUserState);
  const router = useRouter();
  const { updateCourse } = useInvalidator();

  const studyBlock = props.studyBlock;
  const course = props.course;
  const id = props.course.id;
  const gradeMap = props.course.status.gradeMap;

  const cb = useClipboard(course.id?.toString() || "");
  const [deleting, isDeleting] = useState(false);
  const captionColor = useColorModeValue("gray.700", "gray.200");
  const disc = useDisclosure();
  const cancelref = useRef<any>();
  const toast = useToast();
  const [name, setName] = useState(course?.longName);
  const contrastingColor = useColorModeValue("white", themeConstants.darkModeContrastingColor);
  const [sectionLoadingUpdate, setSectionLoadingUpdate] = useState("");
  const tooltipColor = useColorModeValue("white", "black");
  return (
    <div>
      <Head>
        <title>{course?.longName ?? "Loading..."}</title>
      </Head>
      <TopBar />

      <>
        <Box bgColor={course?.color} className="p-8">
          <Box className="text-3xl">
            <span className="mr-4">
              <Text display="inline">{course?.courseCodeName}</Text> {course?.courseCodeNumber}
            </span>
            {sectionLoadingUpdate !== "longName" ? (
              <GkEditable
                onSubmit={async (v) => {
                  setSectionLoadingUpdate("longName");
                  const d = await fetch(`/api/block/${studyBlock.id.toString()}/course/${course?.id}`, {
                    body: JSON.stringify({ longName: v }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                    method: "POST",
                  });
                  if (d.ok) {
                    const newcourse = await d.json();
                    updateCourse(newcourse.id, newcourse);
                    setSectionLoadingUpdate("");
                  } else {
                  }
                }}
                inputProps={{ size: course?.longName.length, style: { display: "inline", color: "black" } }}
                displayProps={{ style: { display: "inline", fontWeight: "bold" } }}
                value={name}
                onChange={(e) => setName(e)}
              />
            ) : (
              <>
                <Spinner />
              </>
            )}
          </Box>
          <div className="text-xl" style={{ color: "#DDDDDD" }}>
            <span className="mr-4">
              <Box
                display="inline"
                color="brand.900"
                style={
                  {
                    /*color: pickTextColorBasedOnBgColorAdvanced(course?.color, "white", "black")*/
                  }
                }
              >
                <span>{studyBlock?.name}</span>
              </Box>
              <IconButton
                onClick={() => {
                  disc.onOpen();
                }}
                className="ml-4"
                icon={<DeleteIcon />}
                size="xs"
                aria-label={"Delete"}
                colorScheme="brand"
              />
              <Button size="xs" ml={2} onClick={cb.onCopy} colorScheme="brand" disabled={cb.hasCopied}>
                {cb.hasCopied ? "Copied" : "Copy share code"}
              </Button>
            </span>
            <AlertDialog isOpen={disc.isOpen} leastDestructiveRef={cancelref} onClose={disc.onClose}>
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete course &lsquo;{course?.longName}&rsquo;
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    Are you <strong>sure</strong> you want to delete {course?.longName}? <br />
                    This will delete <strong>all</strong> results.
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelref} onClick={disc.onClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        isDeleting(true);
                        fetch(`/api/block/${course?.studyBlockId}/course/${course?.id}`, { method: "DELETE" }).then(() => {
                          isDeleting(false);
                          toast({
                            title: "Course deleted.",
                            description: course?.courseCodeName + " " + course?.courseCodeNumber + " deleted.",
                            duration: 4000,
                            isClosable: true,
                            status: "success",
                          });
                          router.push("/");
                          updateCourse(course?.id, null);
                        });
                      }}
                      isLoading={deleting}
                      ml={3}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </div>
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
                    <StatNumber>{props.course.grades.projected?.letter}</StatNumber>
                    <StatHelpText>{((props.course.grades.projected?.numerical ?? 0) * 100).toPrecision(4)}%</StatHelpText>
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
                          width: props.course.grades.actual?.numerical * 100 + "%",
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
                          width: 100 - props.course.grades.maximumPossible?.numerical * 100 + "%",
                        }}
                        className="rounded"
                      >
                        &nbsp;
                      </div>
                      <div
                        style={{
                          backgroundColor: course?.color ?? "",
                          width: "" + props.course.grades.projected?.numerical * 100 + "%",
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
                            atProgressPercentage={gradeNumber * 100}
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
                        atProgressPercentage={props.course.grades.actual?.numerical * 100}
                        position="top"
                      >
                        <Tooltip
                          color={tooltipColor}
                          label={
                            "Lowest possible grade: " +
                            props.course.grades.actual?.letter +
                            " (" +
                            (props.course.grades.actual?.numerical * 100).toPrecision(3) +
                            "%)"
                          }
                        >
                          <InfoOutlineIcon w={4} h={4} />
                        </Tooltip>
                      </ProgressBarCaption>
                      <ProgressBarCaption
                        color={"grey"}
                        atProgressPercentage={props.course.grades.maximumPossible?.numerical * 100}
                        position="top"
                      >
                        <Tooltip
                          color={tooltipColor}
                          label={
                            "Maximum possible grade: " +
                            props.course.grades.maximumPossible?.letter +
                            " (" +
                            (props.course.grades.maximumPossible?.numerical * 100).toPrecision(3) +
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