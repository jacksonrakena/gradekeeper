import { CourseBanner } from "@/components/app/course/CourseBanner";
import { ProjectionWidget } from "@/components/app/course/widgets/projection/ProjectionWidget";
import { ResultsWidget } from "@/components/app/course/widgets/results/ResultsWidget";
import { Box, Link as CLink, Heading, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import Footer from "../../../components/app/Footer";
import AveragesWidget from "../../../components/app/course/widgets/averages/AveragesWidget";
import CourseCompletedWidget from "../../../components/app/course/widgets/completion/CourseCompletedWidget";
import CourseSwitcher from "../../../components/app/nav/CourseSwitcher";
import { TopBar } from "../../../components/app/nav/TopBar";
import { GenericLoading } from "../../../components/generic/GenericLoading";
import { ProcessedCourse, ProcessedStudyBlock } from "../../../lib/logic/processing";
import { SessionState, getTicket } from "../../../lib/state/auth";
import { ProcessedUserState } from "../../../lib/state/course";
import themeConstants from "../../../lib/theme";

const CourseView = () => {
  const cookie = useAtomValue(SessionState);
  const navigate = useNavigate();
  const user = useAtomValue(ProcessedUserState);
  const { course_id, block_id } = useParams();
  const studyBlock = user?.studyBlocks.find((e) => e.id === block_id);
  const course = studyBlock?.courses.find((a) => a.id === course_id);

  useEffect(() => {
    if (!getTicket()) navigate("/");
  }, [cookie, navigate, user, studyBlock]);

  if (!user) return <GenericLoading />;

  return (
    <>
      <TopBar leftWidget={<CourseSwitcher currentCourse={course} />} />
      {(!course || !studyBlock) && (
        <Box my={"20"}>
          <VStack>
            <Heading size="md">Course not found.</Heading>
            <Text>
              Would you like to{" "}
              <CLink color="teal.700">
                <Link to="/">go back to all courses?</Link>
              </CLink>
            </Text>
          </VStack>
        </Box>
      )}
      {course && studyBlock && <CourseViewInner course={course} studyBlock={studyBlock} />}
    </>
  );
};

const CourseViewInner = ({ course, studyBlock }: { course: ProcessedCourse; studyBlock: ProcessedStudyBlock }) => {
  const contrastingColor = useColorModeValue("white", themeConstants.darkModeContrastingColor);
  return (
    <>
      <CourseBanner course={course} studyBlock={studyBlock} />

      {course.status.isCompleted && (
        <div className="p-6 m-4 shadow-md rounded-md" style={{ backgroundColor: contrastingColor }}>
          <CourseCompletedWidget course={course} />
        </div>
      )}

      <div className="flex flex-wrap">
        <Box className="grow m-4 p-6 shadow-md rounded-md overflow-auto" style={{ backgroundColor: contrastingColor }}>
          <ResultsWidget course={course} />
        </Box>
        {!course.status.isCompleted && (
          <Box className="grow m-4 p-6 shadow-md rounded-md" style={{ backgroundColor: contrastingColor }}>
            <AveragesWidget course={course} />
          </Box>
        )}
      </div>

      {!course.status.isCompleted && (
        <div className="p-6 m-4 shadow-md rounded-md" style={{ backgroundColor: contrastingColor }}>
          <ProjectionWidget course={course} />
        </div>
      )}
      <Box px={8} py={2} pb={6}>
        <Footer />
      </Box>
    </>
  );
};

export default CourseView;
