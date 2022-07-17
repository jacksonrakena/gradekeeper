import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Box,
  Button,
  Divider,
  Heading,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { ProcessedStudyBlock, _null } from "../../../lib/logic";
import { useUserContext } from "../../../lib/UserContext";
import Footer from "../Footer";
import { TopBar } from "../TopBar";
import CreateBlockModal from "./CreateBlockModal";
import CreateCourseModal from "./CreateCourseModal";
import { StudyBlockCourseList } from "./StudyBlockCourseList";

const CourseList = () => {
  const { user } = useUserContext();
  const isLoading = !user;
  const cancelRef = useRef<any>();
  const [deleteStudyBlock, setDeleteStudyBlock] = useState(_null<ProcessedStudyBlock>());
  const toast = useToast();
  const router = useRouter();
  const [isDeletingStudyBlock, setIsDeletingSb] = useState(false);
  const context = useUserContext();
  const [courseCreateBlockId, setCourseCreateBlockId] = useState("");
  const createBlockDisclosure = useDisclosure();

  const closedStudyBlocks = user?.processedStudyBlocks
    .filter((e) => Date.now() > new Date(e.endDate).getTime())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  const openStudyBlocks = user?.processedStudyBlocks
    .filter((e) => Date.now() < new Date(e.endDate).getTime())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
  return (
    <>
      <div className="mb-12">
        <TopBar />
        <>
          <Head>
            <title>My courses</title>
          </Head>
          <AlertDialog
            isOpen={deleteStudyBlock !== null}
            leastDestructiveRef={cancelRef}
            onClose={() => {
              setDeleteStudyBlock(null);
            }}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete block &lsquo;{deleteStudyBlock?.name}&rsquo;
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you <strong>sure</strong> you want to delete {deleteStudyBlock?.name}? <br />
                  This will delete <strong>{deleteStudyBlock?.processedCourses.length}</strong> courses.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button
                    ref={cancelRef}
                    onClick={() => {
                      setDeleteStudyBlock(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={async () => {
                      setIsDeletingSb(true);
                      await fetch(`/api/block/${deleteStudyBlock?.id ?? ""}`, { method: "DELETE" });
                      await context.redownload();
                      toast({
                        title: "Study block deleted.",
                        description: deleteStudyBlock?.name + " deleted.",
                        duration: 4000,
                        isClosable: true,
                        status: "success",
                      });
                      setIsDeletingSb(false);
                      setDeleteStudyBlock(null);
                    }}
                    isLoading={isDeletingStudyBlock}
                    ml={3}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
          <CreateCourseModal blockId={courseCreateBlockId} isOpen={!!courseCreateBlockId} onClose={() => setCourseCreateBlockId("")} />
          <CreateBlockModal isOpen={createBlockDisclosure.isOpen} onClose={createBlockDisclosure.onClose} />
          <div>
            <div className={"flex flex-col px-12"}>
              {(!user || isLoading) && <Spinner />}
              {user && !isLoading && (
                <Box>
                  {(!user?.processedStudyBlocks || user?.processedStudyBlocks?.length === 0) && (
                    <div>
                      <div>
                        <Box mb={6}>
                          <Heading as="h2" size="md">
                            Welcome to Gradekeeper.
                          </Heading>
                          <Heading size="sm">Let&apos;s get you set up.</Heading>
                        </Box>
                        <Box mb={6}>
                          Gradekeeper is organised around a system of &lsquo;study blocks&rsquo;, which can be trimesters, semesters, or
                          terms, depending on your university.
                        </Box>
                        <Box mb={6}>
                          <Alert>
                            <AlertIcon />
                            <AlertDescription>Let&apos;s start by making a study block.</AlertDescription>
                          </Alert>
                        </Box>
                        <Button colorScheme="orange" size="sm" onClick={createBlockDisclosure.onOpen}>
                          + New study block
                        </Button>
                      </div>
                    </div>
                  )}
                  {user &&
                    user.processedStudyBlocks &&
                    (user?.processedStudyBlocks?.length ?? 0) > 0 &&
                    openStudyBlocks &&
                    openStudyBlocks
                      .sort((a, b) => {
                        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
                      })
                      .map((studyBlock) => (
                        <StudyBlockCourseList
                          setCourseCreateBlockId={setCourseCreateBlockId}
                          setDeleteStudyBlock={setDeleteStudyBlock}
                          key={studyBlock.id}
                          studyBlock={studyBlock}
                        />
                      ))}
                  {user?.processedStudyBlocks && user?.processedStudyBlocks.length > 0 && (
                    <Button colorScheme="brand" size="sm" onClick={createBlockDisclosure.onOpen}>
                      + New term
                    </Button>
                  )}
                  {closedStudyBlocks && closedStudyBlocks.length > 0 && (
                    <>
                      <Divider my={4} />
                      <Text my={4} fontWeight="semibold" size={"xs"} color={"GrayText"}>
                        Previous terms
                      </Text>
                      {user &&
                        user.processedStudyBlocks &&
                        (user?.processedStudyBlocks?.length ?? 0) > 0 &&
                        closedStudyBlocks &&
                        closedStudyBlocks
                          .sort((a, b) => {
                            return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
                          })
                          .map((studyBlock) => (
                            <StudyBlockCourseList
                              setCourseCreateBlockId={setCourseCreateBlockId}
                              setDeleteStudyBlock={setDeleteStudyBlock}
                              key={studyBlock.id}
                              studyBlock={studyBlock}
                            />
                          ))}
                    </>
                  )}
                </Box>
              )}
            </div>
          </div>
        </>
      </div>
      <Box mx={12} mb={4}>
        <Footer />
      </Box>
    </>
  );
};

export default CourseList;
