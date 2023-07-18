import {
  Alert,
  AlertDescription,
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

import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { ProcessedStudyBlock, _null } from "../../lib/logic/processing";
import Footer from "../../src/components/app/Footer";
import { TopBar } from "../../src/components/app/nav/TopBar";
import { ProcessedUserState } from "../../state/course";
import CreateBlockModal from "./CreateBlockModal";
import { StudyBlockCourseList } from "./study-term/StudyBlockCourseList";

const Dashboard = () => {
  const user = useRecoilValue(ProcessedUserState);
  const isLoading = !user;
  const cancelRef = useRef<any>();
  const [deleteStudyBlock, setDeleteStudyBlock] = useState(_null<ProcessedStudyBlock>());
  const toast = useToast();
  const [isDeletingStudyBlock, setIsDeletingSb] = useState(false);
  const [courseCreateBlockId, setCourseCreateBlockId] = useState("");
  const createBlockDisclosure = useDisclosure();
  // useEffect(() => {
  //   if (currentCourseId) setCurrentCourseId(null);
  //   if (currentBlockId) setCurrentBlockId(null);
  // }, [router.pathname]);

  const closedStudyBlocks = user?.processedStudyBlocks
    .filter((e) => Date.now() > new Date(e.endDate).getTime())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  const openStudyBlocks = user?.processedStudyBlocks
    .filter((e) => Date.now() < new Date(e.endDate).getTime())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
  console.log("user", user);
  console.log("loading", isLoading);
  console.log("open", openStudyBlocks);
  return (
    <>
      <div className="mb-12">
        <TopBar />
        <>
          <CreateBlockModal isOpen={createBlockDisclosure.isOpen} onClose={createBlockDisclosure.onClose} />
          <div>
            <Box className={"flex flex-col"} px={[6, 12]}>
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
                      .map((studyBlock) => <StudyBlockCourseList key={studyBlock.id} studyBlock={studyBlock} />)}
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
                          .map((studyBlock) => <StudyBlockCourseList key={studyBlock.id} studyBlock={studyBlock} />)}
                    </>
                  )}
                </Box>
              )}
            </Box>
          </div>
        </>
      </div>
      <Box mx={12} mb={4}>
        <Footer />
      </Box>
    </>
  );
};

export default Dashboard;
