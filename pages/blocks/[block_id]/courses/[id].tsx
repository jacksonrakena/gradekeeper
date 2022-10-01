import { Center, Spinner } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import CourseView from "../../../../components/app/course-page/CourseView";
import { TopBar } from "../../../../components/app/nav/TopBar";
import { SelectedCourseIdState, SelectedCourseState, SelectedStudyBlockIdState, SelectedStudyBlockState } from "../../../../state/course";

const CoursePage: NextPage = () => {
  const router = useRouter();
  const { block_id, id } = router.query;
  const setStudyBlockId = useSetRecoilState(SelectedStudyBlockIdState);
  const setCourseId = useSetRecoilState(SelectedCourseIdState);

  const studyBlock = useRecoilValue(SelectedStudyBlockState);
  const course = useRecoilValue(SelectedCourseState);

  useEffect(() => {
    if (router.isReady) {
      setStudyBlockId((block_id as string) ?? null);
      setCourseId((id as string) ?? null);
      console.log("Setting " + block_id + " and " + id);
    }
  }, [block_id, id, router.isReady]);

  const courseView = useMemo(() => {
    if (!studyBlock || !course) return <></>;
    return <CourseView studyBlock={studyBlock} course={course} key={Math.random()} />;
  }, [studyBlock, course]);

  if (!studyBlock || !course) {
    return (
      <>
        <TopBar />
        <Center>
          <Spinner color="brand" />
        </Center>
      </>
    );
  } else return courseView;
};

export default CoursePage;
