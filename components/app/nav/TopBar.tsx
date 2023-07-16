import { Button, SkeletonText } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useAuth } from "../../../state/auth";
import { ProcessedUserState, SelectedCourseIdState } from "../../../state/course";
import AccountButton from "./AccountButton";
import CourseSwitcher from "./CourseSwitcher";

export const TopBar = () => {
  const auth = useAuth();
  // const sessiondata = useSession();
  // const session = sessiondata.data;
  const user = useRecoilValue(ProcessedUserState);
  const currentSubjectId = useRecoilValue(SelectedCourseIdState);
  const studyBlocks = user?.processedStudyBlocks;
  const subjects = user?.processedStudyBlocks?.filter((e) => Date.now() < new Date(e.endDate).getTime()).flatMap((d) => d.processedCourses);
  const currentSubject =
    subjects && currentSubjectId
      ? user?.processedStudyBlocks?.flatMap((d) => d.processedCourses).filter((d) => d.id === currentSubjectId)[0]
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
          {subjects && currentSubject && studyBlocks && currentSubjectId && <CourseSwitcher blockMap={blockMap} />}
        </div>
        <div>
          <SkeletonText isLoaded={auth.loggedIn}>
            {auth.loggedIn ? (
              <AccountButton />
            ) : (
              <>
                <Button colorScheme={"brand"} onClick={() => {}}>
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
