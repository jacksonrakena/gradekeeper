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
  Skeleton,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useClipboard,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import AveragesWidget from "../../../../components/app/courseView/AveragesWidget";
import ComponentEditModal from "../../../../components/app/courseView/ComponentEditModal";
import ComponentRow from "../../../../components/app/courseView/ComponentRow";
import CourseCompletedWidget from "../../../../components/app/courseView/CourseCompletedWidget";
import Footer from "../../../../components/app/Footer";
import { TopBar } from "../../../../components/app/TopBar";
import { FullSubjectComponent } from "../../../../lib/fullEntities";
import {
  adjust,
  calculateProjectedGradeForComponent,
  pickTextColorBasedOnBgColorAdvanced,
  processCourseData,
  _null,
} from "../../../../lib/logic";
import themeConstants from "../../../../themeConstants";
import { useUserContext } from "../../../../UserContext";

const SubjectPage: NextPage = () => {
  const router = useRouter();
  const { block_id, id } = router.query;
  const user = useUserContext();
  const studyBlock = user.user?.studyBlocks.filter((e) => e.id === block_id)[0];
  const course0 = studyBlock?.subjects.filter((d) => d.id === id)[0];
  const subject = course0;
  const courseProcessed = user && course0 && processCourseData(course0, user?.user?.gradeMap);
  const actualGrade = courseProcessed?.grades?.actual;
  const projectedGrade = courseProcessed?.grades?.projected;
  const maximumPossibleGrade = courseProcessed?.grades?.maximumPossible;
  const projected = projectedGrade;
  const grade = actualGrade;
  const gradeMap = user.user?.gradeMap;
  const isLoading = !course0;
  const cb = useClipboard(id?.toString() || "");
  const [component, setTargetComponent] = useState(_null<FullSubjectComponent>());
  const [deleting, isDeleting] = useState(false);
  const captionColor = useColorModeValue("gray.700", "gray.200");
  const disc = useDisclosure();
  const cancelref = useRef();
  const toast = useToast();

  return (
    <div>
      <Head>
        <title>{subject?.longName ?? "Loading..."}</title>
      </Head>
      <TopBar currentSubjectId={id?.toString()} />
      {component !== null ? (
        <ComponentEditModal
          subject={subject}
          blockId={subject?.studyBlockId ?? ""}
          onReceiveUpdatedData={(newcomp) => {
            setTargetComponent(null);
          }}
          gradeMap={gradeMap}
          onClose={() => {
            setTargetComponent(null);
          }}
          showing={component !== null}
          component={component}
        />
      ) : (
        <></>
      )}
      <Skeleton isLoaded={!isLoading}>
        <div style={{ backgroundColor: subject?.color }} className="p-8">
          <div className="text-3xl" style={{ color: pickTextColorBasedOnBgColorAdvanced(subject?.color ?? "", "white", "") }}>
            <span className="mr-4">
              {subject?.courseCodeName} {subject?.courseCodeNumber}
            </span>
            <span style={{ fontWeight: "bold" }}>{subject?.longName}</span>
          </div>
          <div className="text-xl" style={{ color: "#DDDDDD" }}>
            <span className="mr-4">
              <span style={{ fontWeight: "" }}>Block:</span> <span>{studyBlock?.name}</span>
              <IconButton
                onClick={() => {
                  disc.onOpen();
                }}
                className="ml-4"
                icon={<DeleteIcon />}
                size="xs"
                aria-label={"Delete"}
                colorScheme="teal"
              />
              <Button size="xs" ml={2} onClick={cb.onCopy} colorScheme="teal" disabled={cb.hasCopied}>
                {cb.hasCopied ? "Copied" : "Copy share code"}
              </Button>
            </span>
            <AlertDialog isOpen={disc.isOpen} leastDestructiveRef={cancelref} onClose={disc.onClose}>
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete course &lsquo;{subject?.longName}&rsquo;
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    Are you <strong>sure</strong> you want to delete {subject?.longName}? <br />
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
                        fetch(`/api/block/${subject?.studyBlockId}/course/${subject?.id}`, { method: "DELETE" }).then(() => {
                          isDeleting(false);
                          toast({
                            title: "Course deleted.",
                            description: subject?.courseCodeName + " " + subject?.courseCodeNumber + " deleted.",
                            duration: 4000,
                            isClosable: true,
                            status: "success",
                          });
                          router.push("/");
                          user.deleteCourse(subject?.id);
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
        </div>

        {courseProcessed?.status.isCompleted && (
          <div
            className="p-6 m-4 shadow-md rounded-md"
            style={{ backgroundColor: useColorModeValue("white", themeConstants.darkModeContrastingColor) }}
          >
            <CourseCompletedWidget course={course0} processed={courseProcessed} gradeMap={gradeMap} />
          </div>
        )}

        <div className="flex flex-wrap">
          <div
            className="grow m-4 p-6 shadow-md rounded-md overflow-auto"
            style={{ backgroundColor: useColorModeValue("white", themeConstants.darkModeContrastingColor) }}
          >
            <div style={{ color: subject?.color }} className="text-2xl mb-2 font-bold">
              Results
            </div>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th pl={0}>Name</Th>
                    <Th pl={0}>Weight</Th>
                    <Th pl={0}>Score</Th>
                    <Th pl={0}>Grade</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {subject?.components?.map((e, i) => {
                    console.log(e);
                    const grade = calculateProjectedGradeForComponent(e);
                    return (
                      <ComponentRow
                        onRequestModalOpen={() => {
                          setTargetComponent(e);
                        }}
                        subject={subject}
                        key={e.id}
                        component={e}
                        componentGrade={grade}
                      />
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </div>

          {!courseProcessed?.status?.isCompleted && (
            <AveragesWidget course={course0} processed={courseProcessed} gradeMap={user?.user?.gradeMap} />
          )}
        </div>

        {!courseProcessed?.status.isCompleted && (
          <div
            className="p-6 m-4 shadow-md rounded-md"
            style={{ backgroundColor: useColorModeValue("white", themeConstants.darkModeContrastingColor) }}
          >
            <div className="">
              <>
                <div className="lg:flex">
                  <Stat className="basis-1/4" style={{ WebkitFlex: "0 !important" }}>
                    <StatLabel fontSize="lg">Projected grade</StatLabel>
                    <StatNumber>{projected?.letter}</StatNumber>
                    <StatHelpText>{((projected?.numerical ?? 0) * 100).toPrecision(4)}%</StatHelpText>
                  </Stat>
                  <div className="py-3 flex grow mb-6">
                    <div style={{ position: "relative", backgroundColor: "#D9D9D9", height: "30px" }} className="rounded flex grow">
                      <div
                        style={{
                          position: "absolute",
                          height: "30px",
                          background: `repeating-linear-gradient(45deg, ${adjust(subject?.color ?? "", -20)}, ${adjust(
                            subject?.color ?? "",
                            -20
                          )} 10px, ${adjust(subject?.color ?? "", -40)} 10px, ${adjust(subject?.color ?? "", -40)} 20px)`,
                          width: actualGrade?.numerical * 100 + "%",
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
                          width: 100 - maximumPossibleGrade?.numerical * 100 + "%",
                        }}
                        className="rounded"
                      >
                        &nbsp;
                      </div>
                      <div
                        style={{
                          backgroundColor: subject?.color ?? "",
                          width: "" + projected?.numerical * 100 + "%",
                        }}
                        className="rounded"
                      >
                        &nbsp;
                      </div>
                      {Object.keys(gradeMap ?? {})
                        .map((e) => Number.parseFloat(e))
                        .map((gradeNumber) => (
                          <ProgressBarAmendment
                            key={gradeNumber}
                            color={adjust(subject?.color ?? "", -50)}
                            atProgressPercentage={gradeNumber * 100}
                            position="bottom"
                          >
                            <Text color={captionColor}>
                              {(gradeNumber * 100).toFixed(0)} <br />
                              {(gradeMap ?? {})[gradeNumber]}
                            </Text>
                          </ProgressBarAmendment>
                        ))}
                      <ProgressBarAmendment
                        color={adjust(subject?.color ?? "", -40)}
                        atProgressPercentage={actualGrade?.numerical * 100}
                        position="top"
                      >
                        <Tooltip
                          label={
                            "Lowest possible grade: " + actualGrade?.letter + " (" + (actualGrade?.numerical * 100).toPrecision(3) + "%)"
                          }
                        >
                          <InfoOutlineIcon w={4} h={4} />
                        </Tooltip>
                      </ProgressBarAmendment>
                      <ProgressBarAmendment color={"grey"} atProgressPercentage={maximumPossibleGrade?.numerical * 100} position="top">
                        <Tooltip
                          label={
                            "Maximum possible grade: " +
                            maximumPossibleGrade?.letter +
                            " (" +
                            (maximumPossibleGrade?.numerical * 100).toPrecision(3) +
                            "%)"
                          }
                        >
                          <InfoOutlineIcon w={4} h={4} />
                        </Tooltip>
                      </ProgressBarAmendment>
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
      </Skeleton>
    </div>
  );
};

const ProgressBarAmendment = (props: { color: string; atProgressPercentage: number; children; position: "top" | "bottom" }) => {
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
      <Text
        style={{
          position: "absolute",
          left: props.atProgressPercentage - 1 + "%",
          ...topStyling,
        }}
        className="text-xs md:text-base text-center"
        fontWeight={"semibold"}
      >
        {props.children}
      </Text>
    </>
  );
};

export default SubjectPage;
