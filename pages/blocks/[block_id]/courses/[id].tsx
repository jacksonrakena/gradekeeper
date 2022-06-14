import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  Td,
  Text,
  Th,
  Thead,
  Tr,
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
import { useFullCourse } from "../../../../lib/dataHooks";
import {
  adjust,
  calculateLetterGrade,
  calculateProjectedGradeForComponent,
  pickTextColorBasedOnBgColorAdvanced,
  _null,
} from "../../../../lib/logic";
import themeConstants from "../../../../themeConstants";
import { FullSubjectComponent } from "../../lib/fullEntities";

const SubjectPage: NextPage = () => {
  const router = useRouter();
  const { block_id, id } = router.query;
  const courseData = useFullCourse(block_id?.toString() ?? "", id?.toString() ?? "");
  const subject = courseData.subject;
  const grade = courseData.actualGrade;
  const projected = courseData.projectedGrade;
  const gradeMap = courseData.gradeMap;
  const isLoading = courseData.isLoading;
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
      <TopBar otherSubjects={courseData.otherSubjects} currentSubjectId={id} />
      {component !== null ? (
        <ComponentEditModal
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
              <span style={{ fontWeight: "" }}>Block:</span> <span>{subject?.studyBlock.name}</span>
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
                          toast({
                            title: "Course deleted.",
                            description: subject?.courseCodeName + " " + subject?.courseCodeNumber + " deleted.",
                            duration: 4000,
                            isClosable: true,
                            status: "success",
                          });
                          isDeleting(true);
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
            className="shadow-md m-4 p-6 shadow-md rounded-md overflow-auto"
            style={{ backgroundColor: useColorModeValue("white", themeConstants.darkModeContrastingColor) }}
          >
            <div style={{ color: subject?.color }} className="text-2xl mb-2 font-bold">
              Results
            </div>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th className="p-2">Name</Th>
                    <Th className="p-2">Weight</Th>
                    <Th className="p-2">Score</Th>
                    <Th className="p-2">Grade</Th>
                    <Th className="p-2">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {subject?.components?.map((e, i) => {
                    const grade = calculateProjectedGradeForComponent(e);
                    return (
                      <Tr key={e.name}>
                        <Td className="p-2 text-center" style={{ minWidth: "250px" }}>
                          <span style={{ fontWeight: "bold" }}>{e.name}</span>{" "}
                          {e.subcomponents?.length > 1 ? <span>({e.subcomponents.length})</span> : ""}
                        </Td>
                        <Td className="text-center" style={{ minWidth: "150px" }}>
                          {e.subjectWeighting * 100}%
                        </Td>
                        <Td
                          style={{ color: subject?.color, minWidth: "150px" }}
                          className={grade.isAverage ? "flex flex-col text-center font-semibold" : "text-center font-semibold"}
                        >
                          {(grade.value * 100).toFixed(2)}%{grade.isAverage ? <span className="text-xs text-gray-600">Average</span> : ""}
                        </Td>
                        <Td style={{ minWidth: "150px" }} fontWeight={"semibold"} className="text-center">
                          {calculateLetterGrade(grade.value, gradeMap)}
                        </Td>
                        <Td style={{ minWidth: "150px" }} className="text-center">
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
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </div>

          <div
            className="shadow-md w-full m-4 p-6 shadow-md rounded-md"
            style={{ backgroundColor: useColorModeValue("white", themeConstants.darkModeContrastingColor) }}
          >
            <div style={{ color: subject?.color }} className="text-2xl mb-2 font-bold">
              Averages
            </div>
          </div>
        </div>

        <div
          className="p-6 m-4 shadow-md rounded-md"
          style={{ backgroundColor: useColorModeValue("white", themeConstants.darkModeContrastingColor) }}
        >
          <div style={{ color: subject?.color }} className="text-2xl font-bold">
            Projections
          </div>
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
              <div style={{ position: "relative", backgroundColor: "#D9D9D9" }} className="rounded flex grow">
                <div
                  style={{
                    backgroundColor: subject?.color,
                    width: "" + (grade?.numerical ?? 0) * 100 + "%",
                  }}
                  className="rounded"
                >
                  &nbsp;
                </div>
                {Object.keys(gradeMap ?? {})
                  .map((e) => Number.parseFloat(e))
                  .map((gradeNumber) => (
                    <>
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
                    </>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Skeleton>
    </div>
  );
};
export default SubjectPage;
