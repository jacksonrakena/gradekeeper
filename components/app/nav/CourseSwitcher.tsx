import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { Subject } from "@prisma/client";
import { useRouter } from "next/router";
import { ProcessedCourseInfo, ProcessedStudyBlock } from "../../../lib/logic/processing";

const CourseSwitcher = ({
  currentSubject,
  blockMap,
  subjects,
  studyBlocks,
}: {
  currentSubject: ProcessedCourseInfo;
  blockMap: any;
  studyBlocks: ProcessedStudyBlock[];
  subjects: ProcessedCourseInfo[];
}) => {
  const router = useRouter();
  return (
    <Menu isLazy={true}>
      <MenuButton colorScheme={"brand"} as={Button} rightIcon={<ChevronDownIcon />}>
        {currentSubject?.courseCodeName} {currentSubject?.courseCodeNumber}
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => {
            router.push("/");
          }}
        >
          <Text fontWeight="semibold">Dashboard</Text>
        </MenuItem>
        <MenuDivider />
        {Object.keys(blockMap as any)
          .filter((blockName) => blockMap[blockName].filter((gg: any) => gg.id !== currentSubject?.id).length !== 0)
          .map((block) => (
            <MenuGroup key={block} title={studyBlocks?.filter((d) => d.id === block)[0].name}>
              {subjects
                ?.filter((e) => e.id !== currentSubject.id && e.studyBlockId === block)
                .map((d: Subject) => (
                  <MenuItem
                    onClick={() => {
                      router.push(`/blocks/${d.studyBlockId}/courses/${d.id}`);
                    }}
                    key={d.id}
                  >
                    <Text fontWeight={"semibold"} color={d.color}>
                      {d.courseCodeName} {d.courseCodeNumber}: {d.longName}
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
