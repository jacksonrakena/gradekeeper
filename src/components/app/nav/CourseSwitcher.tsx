import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router";
import { ProcessedCourseInfo, ProcessedStudyBlock } from "../../../../lib/logic/processing";
import { ProcessedUserState } from "../../../lib/state/course";

const CourseSwitcher = (props: { currentCourse: ProcessedCourseInfo; currentStudyBlock: ProcessedStudyBlock }) => {
  const navigate = useNavigate();

  const user = useAtomValue(ProcessedUserState);
  const blocks =
    user?.studyBlocks?.filter(
      (e) => Date.now() < new Date(e.endDate).getTime() && e.courses.filter((d) => d.id !== props.currentCourse?.id).length !== 0
    ) ?? [];

  return (
    <Menu isLazy={true}>
      <MenuButton colorScheme={"brand"} as={Button} rightIcon={<ChevronDownIcon />}>
        {props.currentCourse?.courseCodeName} {props.currentCourse?.courseCodeNumber}
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => {
            navigate("/");
          }}
        >
          <Text fontWeight="semibold">Dashboard</Text>
        </MenuItem>
        <MenuDivider />
        {blocks.map((block) => (
          <MenuGroup key={block.id} title={block.name}>
            {block.courses
              ?.filter((e) => e.id !== props.currentCourse?.id)
              .map((course) => (
                <MenuItem
                  onClick={() => {
                    navigate(`/blocks/${block.id}/courses/${course.id}`);
                  }}
                  key={course.id}
                >
                  <Text fontWeight={"semibold"} color={course.color}>
                    {course.courseCodeName} {course.courseCodeNumber}: {course.longName}
                  </Text>
                </MenuItem>
              ))}
          </MenuGroup>
        ))}
      </MenuList>
    </Menu>
  );
};

export default CourseSwitcher;
