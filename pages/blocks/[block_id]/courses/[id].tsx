import { Center, Spinner } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import CourseView from "../../../../components/app/course-screens/CourseView";
import { TopBar } from "../../../../components/app/nav/TopBar";
import { useUserContext } from "../../../../lib/UserContext";

const CoursePage: NextPage = () => {
  const router = useRouter();
  const { block_id, id } = router.query;
  const user = useUserContext();
  const studyBlock = user.user?.processedStudyBlocks?.filter((e) => e.id === block_id)[0];
  const course0 = studyBlock?.processedCourses.filter((d) => d.id === id)[0];
  if (!course0 || !studyBlock) {
    return (
      <>
        <TopBar />
        <Center>
          <Spinner color="brand" />
        </Center>
      </>
    );
  } else return <CourseView studyBlock={studyBlock} course={course0} key={id?.toString()} />;
};

export default CoursePage;
