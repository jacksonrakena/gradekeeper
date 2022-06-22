import { DeleteIcon, EditIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Skeleton,
  Spinner,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
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
import ComponentEditModal from "../../../../components/app/course/ComponentEditModal";
import { TopBar } from "../../../../components/TopBar";
import { FullSubject, FullSubjectComponent } from "../../../../lib/fullEntities";
import {
  adjust,
  calculateLetterGrade,
  calculateProjectedGradeForComponent,
  pickTextColorBasedOnBgColorAdvanced,
  processCourseData,
  ProcessedCourseData,
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
                          user.deleteCourse(subject?.id);
                          isDeleting(false);
                          toast({
                            title: "Course deleted.",
                            description: subject?.courseCodeName + " " + subject?.courseCodeNumber + " deleted.",
                            duration: 4000,
                            isClosable: true,
                            status: "success",
                          });
                          router.push("/");
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

          <Box
            className="grow m-4 p-6 shadow-md rounded-md"
            style={{ backgroundColor: useColorModeValue("white", themeConstants.darkModeContrastingColor) }}
          >
            <div style={{ color: subject?.color }} className="text-2xl mb-2 font-bold">
              Averages
            </div>
            <div className="w-48">d</div>
          </Box>
        </div>

        <div
          className="p-6 m-4 shadow-md rounded-md"
          style={{ backgroundColor: useColorModeValue("white", themeConstants.darkModeContrastingColor) }}
        >
          <div style={{ color: subject?.color }} className="text-2xl font-bold">
            Projections
          </div>
          <div className="">
            {courseProcessed?.status.isCompleted ? (
              <CourseCompletedProjectionsSection course={course0} processed={courseProcessed} />
            ) : (
              <>
                <div className="lg:flex mt-6 wrap">
                  <Stat className="basis-1/4" style={{ WebkitFlex: "0 !important" }}>
                    <StatLabel>Projected grade</StatLabel>
                    <StatNumber>{projected?.letter}</StatNumber>
                    <StatHelpText>{((projected?.numerical ?? 0) * 100).toPrecision(4)}%</StatHelpText>
                  </Stat>
                  <div className="py-3 flex grow mb-6">
                    <div style={{ position: "relative", backgroundColor: "#D9D9D9" }} className="rounded flex grow">
                      <div
                        style={{
                          backgroundColor: subject?.color,
                          width: "" + (projected?.numerical ?? 0) * 100 + "%",
                        }}
                        className="rounded"
                      >
                        &nbsp;
                      </div>
                      {Object.keys(gradeMap ?? {})
                        .map((e) => Number.parseFloat(e))
                        .map((gradeNumber) => (
                          <div key={gradeNumber}>
                            <div
                              style={{
                                borderColor: adjust(subject?.color ?? "", -50),
                                position: "absolute",
                                height: "99%",
                                width: "1px",
                                left: gradeNumber * 100 + "%",
                              }}
                              className="border border-black"
                            >
                              &nbsp;
                            </div>
                            <Text
                              style={{
                                position: "absolute",
                                left: gradeNumber * 100 - 1 + "%",
                                top: "110%",
                              }}
                              className="text-xs md:text-base"
                              fontWeight={"semibold"}
                              color={captionColor}
                            >
                              {(gradeNumber * 100).toFixed(0)} <br />
                              {(gradeMap ?? {})[gradeNumber]}
                            </Text>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="lg:flex mt-12">
                  <Stat className="basis-1/4" style={{ WebkitFlex: "0 !important" }}>
                    <StatLabel>Actual progress so far</StatLabel>
                    <StatNumber>{grade?.letter}</StatNumber>
                    <StatHelpText>{((grade?.numerical ?? 0) * 100).toPrecision(4)}%</StatHelpText>
                  </Stat>
                  <div className="py-3 flex grow mb-6">
                    <AmendableProgressBar
                      backgroundColor="#D9D9D9"
                      progressColor={subject?.color ?? ""}
                      percentageProgress={actualGrade?.numerical * 100}
                    >
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
                        color={adjust(subject?.color ?? "", -90)}
                        atProgressPercentage={maximumPossibleGrade?.numerical * 100}
                        position="top"
                      >
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
                    </AmendableProgressBar>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Skeleton>
    </div>
  );
};

const ComponentRow = (props: {
  component: FullSubjectComponent;
  subject: FullSubject;
  componentGrade: { value: number; isUnknown: boolean; isAverage: boolean };
  onRequestModalOpen: () => void;
}) => {
  const user = useUserContext();
  const e = props.component;
  const subject = props.subject;
  const grade = props.componentGrade;
  const [singularValue, setSingularValue] = useState(
    props.component.subcomponents[0].isCompleted ? (grade.value * 100).toFixed(2).toString() + "%" : "0%"
  );
  const [name, setName] = useState(props.component.name);
  const [sectionLoadingUpdate, setSectionLoadingUpdate] = useState("");
  const [touched, setTouched] = useState(false);
  return (
    <Tr key={e.name}>
      <Td pl={0} style={{}}>
        {sectionLoadingUpdate !== "name" ? (
          <>
            {e.subcomponents.length === 1 ? (
              <span style={{ fontWeight: "bold" }}>
                <Editable
                  value={name}
                  onChange={(e) => {
                    setName(e);
                    setTouched(true);
                  }}
                  onSubmit={async () => {
                    if (touched) {
                      setSectionLoadingUpdate("name");
                      const response = await fetch(
                        `/api/block/${subject.studyBlockId}/course/${subject.id}/component/${props.component.id}`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            name: name,
                          }),
                        }
                      );
                      const data = await response.json();
                      user.updateCourse(props.subject.id, {
                        ...props.subject,
                        components: props.subject.components.map((cc) => {
                          if (cc.id !== props.component.id) return cc;
                          return { ...cc, name: name };
                        }),
                      });
                      setSectionLoadingUpdate("");
                      setTouched(false);
                    }
                  }}
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              </span>
            ) : (
              <>
                <span style={{ fontWeight: "bold" }}>{e.name}</span>{" "}
                {e.subcomponents?.length > 1 ? <span>({e.subcomponents.length})</span> : ""}
              </>
            )}
          </>
        ) : (
          <>
            {" "}
            <Spinner color={subject.color} size="sm" />
          </>
        )}
      </Td>
      <Td pl={0} className="text-center" style={{}}>
        {e.subjectWeighting * 100}%
      </Td>
      <Td
        pl={0}
        style={{ color: subject?.color }}
        className={grade.isAverage ? "flex flex-col text-center font-semibold" : "text-center font-semibold"}
      >
        {sectionLoadingUpdate === "score" ? (
          <>
            <Spinner color={subject.color} size="sm" />
          </>
        ) : (
          <>
            {e.subcomponents?.length === 1 ? (
              <Editable
                cursor={"pointer"}
                onSubmit={async (e) => {
                  if (touched) {
                    const actualGradeValue = Number.parseFloat(e.replaceAll("%", "")) / 100.0;
                    setSingularValue(e ? Number.parseFloat(e).toFixed(2).toString() + "%" : "");

                    setSectionLoadingUpdate("score");
                    const response = await fetch(
                      `/api/block/${subject.studyBlockId}/course/${subject.id}/component/${props.component.id}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          subcomponents: [
                            {
                              ...props.component.subcomponents[0],
                              gradeValuePercentage: !!e ? actualGradeValue : 0,
                              isCompleted: !!e,
                            },
                          ],
                        }),
                      }
                    );
                    const data = await response.json();
                    user.updateCourse(props.subject.id, {
                      ...props.subject,
                      components: props.subject.components.map((cc) => {
                        if (cc.id !== props.component.id) return cc;
                        return data;
                      }),
                    });
                    if (!singularValue) setSingularValue("0%");
                    setSectionLoadingUpdate("");
                    setTouched(false);
                  }
                }}
                onChange={(f) => {
                  setTouched(true);
                  setSingularValue(f);
                }}
                value={singularValue}
              >
                <Box minW={"50px"}>
                  <EditablePreview cursor={"pointer"} />
                  <EditableInput />
                </Box>
              </Editable>
            ) : (
              <>
                {" "}
                {!grade.isUnknown ? (
                  <>
                    <Box
                      cursor="pointer"
                      className="flex"
                      flexDirection={"column"}
                      onClick={() => {
                        props.onRequestModalOpen();
                      }}
                    >
                      {" "}
                      {(grade.value * 100).toFixed(2)}%{grade.isAverage ? <span className="text-xs text-gray-600">Average</span> : ""}
                    </Box>
                  </>
                ) : (
                  <Box
                    cursor="pointer"
                    className="flex"
                    flexDirection={"column"}
                    onClick={() => {
                      props.onRequestModalOpen();
                    }}
                  >
                    Edit
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Td>
      <Td pl={0} style={{}} fontWeight={"semibold"} className="text-center">
        {!grade.isUnknown && calculateLetterGrade(grade.value, user.user?.gradeMap)}
      </Td>
      {false && (
        <Td style={{}} className="text-center">
          <IconButton
            onClick={() => {
              setTargetComponent(e);
            }}
            colorScheme="teal"
            size="sm"
            aria-label={`Edit ${e.name}`}
            icon={<EditIcon />}
          />
        </Td>
      )}
    </Tr>
  );
};

const CourseCompletedProjectionsSection = (props: { course: FullSubject; processed: ProcessedCourseData }) => {
  return (
    <Box textAlign={"center"}>
      <Box>Congratulations, you got an</Box>
      <Box fontSize={48} color={props.course.color} fontWeight="bold">
        {props.processed.grades.actual.letter}
      </Box>
      <Box>{(props.processed.grades.actual.numerical * 100).toPrecision(4)}%</Box>
    </Box>
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

const AmendableProgressBar = (props: { backgroundColor: string; progressColor: string; percentageProgress: number; children }) => {
  return (
    <div style={{ position: "relative", backgroundColor: props.backgroundColor }} className="rounded flex grow">
      <div
        style={{
          backgroundColor: props.progressColor,
          width: "" + props.percentageProgress + "%",
        }}
        className="rounded"
      >
        &nbsp;
      </div>
      {props.children}
    </div>
  );
};
export default SubjectPage;
