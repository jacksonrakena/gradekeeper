import { Box, Button, Divider, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import Footer from "../src/components/app/Footer";
import { TopBar } from "../src/components/app/nav/TopBar";
import { ProcessedUserState } from "../src/lib/state/course";
import CreateBlockModal from "./dashboard/CreateBlockModal";
import { Introduction } from "./dashboard/new-user-experience/Introduction";
import { StudyBlockCourseList } from "./dashboard/study-term/StudyBlockCourseList";

const Dashboard = () => {
  const user = useRecoilValue(ProcessedUserState);
  const isLoading = !user;
  const createBlockDisclosure = useDisclosure();

  const closedStudyBlocks = user?.studyBlocks
    .filter((e) => Date.now() > new Date(e.endDate).getTime())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  const openStudyBlocks = user?.studyBlocks
    .filter((e) => Date.now() < new Date(e.endDate).getTime())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  return (
    <>
      <CreateBlockModal isOpen={createBlockDisclosure.isOpen} onClose={createBlockDisclosure.onClose} />

      <Box className="mb-12">
        <TopBar />

        <div>
          <Box className={"flex flex-col"} px={[6, 12]}>
            {(!user || isLoading) && <Spinner />}
            {user && !isLoading && (
              <Box>
                {(!user?.studyBlocks || user?.studyBlocks?.length === 0) && <Introduction createBlockDisclosure={createBlockDisclosure} />}
                {user &&
                  user.studyBlocks &&
                  (user?.studyBlocks?.length ?? 0) > 0 &&
                  openStudyBlocks &&
                  openStudyBlocks
                    .sort((a, b) => {
                      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
                    })
                    .map((studyBlock) => <StudyBlockCourseList key={studyBlock.id} studyBlock={studyBlock} />)}
                {user?.studyBlocks && user?.studyBlocks.length > 0 && (
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
                      user.studyBlocks &&
                      (user?.studyBlocks?.length ?? 0) > 0 &&
                      closedStudyBlocks &&
                      closedStudyBlocks
                        .sort((a, b) => {
                          return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
                        })
                        .map((studyBlock) => <StudyBlockCourseList key={studyBlock.id} studyBlock={studyBlock} />)}
                  </>
                )}
              </Box>
            )}
          </Box>
        </div>
      </Box>
      <Box mx={12} mb={4}>
        <Footer />
      </Box>
    </>
  );
};

export default Dashboard;
