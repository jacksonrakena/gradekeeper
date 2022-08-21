import { Button, SkeletonText } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useUserContext } from "../../../lib/UserContext";
import AccountButton from "./AccountButton";
import CourseSwitcher from "./CourseSwitcher";

export const TopBar = (props: { currentSubjectId?: string }) => {
  const sessiondata = useSession();
  const session = sessiondata.data;
  const user = useUserContext();
  const studyBlocks = user.user?.processedStudyBlocks;
  const subjects = user.user?.processedStudyBlocks
    ?.filter((e) => Date.now() < new Date(e.endDate).getTime())
    .flatMap((d) => d.processedCourses);
  const currentSubject =
    subjects && props.currentSubjectId
      ? user.user?.processedStudyBlocks?.flatMap((d) => d.processedCourses).filter((d) => d.id === props.currentSubjectId)[0]
      : null;
  const blockMap = subjects?.reduce((block: any, course: any) => {
    block[course.studyBlockId] = block[course.studyBlockId] ?? [];
    block[course.studyBlockId].push(course);
    return block;
  }, {});
  return (
    <div>
      <div className="w-full p-2 flex flex-row">
        <div className="grow">
          {subjects && currentSubject && studyBlocks && props.currentSubjectId && (
            <CourseSwitcher blockMap={blockMap} studyBlocks={studyBlocks} subjects={subjects} currentSubject={currentSubject} />
          )}
        </div>
        <div>
          <SkeletonText isLoaded={sessiondata.status !== "loading"}>
            {session ? (
              <AccountButton session={sessiondata.data} />
            ) : (
              <>
                <Button colorScheme={"brand"} onClick={() => signIn()}>
                  Sign in
                </Button>
              </>
            )}
          </SkeletonText>
        </div>
      </div>
    </div>
  );
};
