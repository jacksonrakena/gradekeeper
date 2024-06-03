import { GenericLoading } from "@/components/generic/GenericLoading";
import { ProcessedUser } from "@/lib/logic/processing";
import { SessionState, getTicket } from "@/lib/state/auth";
import { Box, Button, Divider, Flex, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import Footer from "../components/app/Footer";
import { TopBar } from "../components/app/nav/TopBar";
import { ProcessedUserState } from "../lib/state/course";
import CreateBlockModal from "./dashboard/CreateBlockModal";
import { Introduction } from "./dashboard/new-user-experience/Introduction";
import { StudyBlockCourseList } from "./dashboard/study-term/StudyBlockCourseList";

const ValidatedDashboard = ({ user }: { user: ProcessedUser }) => {
  const createBlockDisclosure = useDisclosure();
  const closedStudyBlocks = user.studyBlocks
    .filter((e) => Date.now() > new Date(e.endDate).getTime())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  const openStudyBlocks = user.studyBlocks
    .filter((e) => Date.now() < new Date(e.endDate).getTime())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  return (
    <>
      <CreateBlockModal isOpen={createBlockDisclosure.isOpen} onClose={createBlockDisclosure.onClose} />
      <Stack spacing={12} mb={6} px={[6, 12]}>
        <Flex flexDirection={"column"}>
          <Box>
            {user.studyBlocks.length === 0 && <Introduction createBlockDisclosure={createBlockDisclosure} />}

            {user.studyBlocks.length > 0 && (
              <>
                {openStudyBlocks
                  .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
                  .map((studyBlock) => (
                    <StudyBlockCourseList key={studyBlock.id} studyBlock={studyBlock} />
                  ))}

                <Button colorScheme="brand" size="sm" onClick={createBlockDisclosure.onOpen}>
                  + New term
                </Button>
              </>
            )}

            {closedStudyBlocks.length > 0 && (
              <>
                <Divider my={4} />
                <Text my={4} fontWeight="semibold" size={"xs"} color={"GrayText"}>
                  Previous terms
                </Text>
                {closedStudyBlocks
                  .sort((a, b) => {
                    return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
                  })
                  .map((studyBlock) => (
                    <StudyBlockCourseList key={studyBlock.id} studyBlock={studyBlock} />
                  ))}
              </>
            )}
          </Box>
        </Flex>
        <Footer />
      </Stack>
    </>
  );
};
const Dashboard = () => {
  const user = useAtomValue(ProcessedUserState);
  const si = useSetAtom(SessionState);

  useEffect(() => {
    if (!getTicket()) si(null);
  }, [user, si]);

  return (
    <>
      <TopBar />
      {user && <ValidatedDashboard user={user} />}
      {!user && <GenericLoading />}
    </>
  );
};

export default Dashboard;
