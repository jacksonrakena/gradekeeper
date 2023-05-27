"use client";
import { Center, Spinner } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import CourseView from "../../../../../components/app/course/CourseView";
import { TopBar } from "../../../../../components/app/nav/TopBar";
import {
  SelectedCourseIdState,
  SelectedCourseState,
  SelectedStudyBlockIdState,
  SelectedStudyBlockState,
} from "../../../../../lib/state/course";

const CoursePage: NextPage = ({ params }: { params: { block_id: string; id: string } }) => {
  const router = useRouter();
  const block_id = params.block_id;
  const id = params.id;
  const setStudyBlockId = useSetRecoilState(SelectedStudyBlockIdState);
  const setCourseId = useSetRecoilState(SelectedCourseIdState);

  const studyBlock = useRecoilValue(SelectedStudyBlockState);
  const course = useRecoilValue(SelectedCourseState);

  useEffect(() => {
    const block_id = params.block_id;
    const id = params.id;
    console.log(params?.toString());
    setStudyBlockId((block_id as string) ?? null);
    setCourseId((id as string) ?? null);
    console.log("Setting " + block_id + " and " + id);
  }, [block_id, id, params]);

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
