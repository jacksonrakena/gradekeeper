import { AddIcon, ChevronDownIcon, CloseIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  SkeletonText,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { Subject } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useUserContext } from "../UserContext";
import { CourseImportModal } from "./app/CourseImportModal";

export const TopBar = (props: { currentSubjectId?: string }) => {
  const sessiondata = useSession();
  const session = sessiondata.data;
  const router = useRouter();
  const user = useUserContext();
  const cm = useColorMode();
  const studyBlocks = user.user?.studyBlocks;
  const subjects = user.user?.studyBlocks?.flatMap((d) => d.subjects);
  const currentSubject = subjects && props.currentSubjectId ? subjects.filter((d) => d.id === props.currentSubjectId)[0] : null;
  const importModal = useDisclosure();
  const blockMap = subjects?.reduce((block, course) => {
    block[course.studyBlockId] = block[course.studyBlockId] ?? [];
    block[course.studyBlockId].push(course);
    return block;
  }, {});
  return (
    <div>
      <CourseImportModal disclosure={importModal} />
      <div className="w-full p-2 flex flex-row">
        <div className="grow">
          {subjects && props.currentSubjectId && (
            <Menu>
              <MenuButton colorScheme={"teal"} as={Button} rightIcon={<ChevronDownIcon />}>
                {currentSubject?.courseCodeName} {currentSubject?.courseCodeNumber}
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  <Text fontWeight="semibold">Home</Text>
                </MenuItem>
                <MenuDivider />
                {Object.keys(blockMap)
                  .filter((blockName) => blockMap[blockName].filter((gg) => gg.id !== currentSubject?.id).length !== 0)
                  .map((block) => (
                    <MenuGroup key={block} title={studyBlocks?.filter((d) => d.id === block)[0].name}>
                      {subjects
                        ?.filter((e) => e.id !== props.currentSubjectId && e.studyBlockId === block)
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
          )}
        </div>
        <div>
          <SkeletonText isLoaded={sessiondata.status !== "loading"}>
            {session ? (
              <>
                <Menu>
                  <MenuButton as={Button} colorScheme={"teal"} rightIcon={<ChevronDownIcon />}>
                    <Flex alignItems="center">
                      <Avatar size="sm" name={session.user?.name} src={session.user?.image} mr={2}></Avatar>
                      {session.user?.name}
                    </Flex>
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => router.push("/")}>Home</MenuItem>
                    <MenuItem onClick={() => importModal.onOpen()} icon={<AddIcon />}>
                      Import a course
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        router.push("/account");
                      }}
                      icon={<SettingsIcon />}
                    >
                      Account
                    </MenuItem>
                    <MenuItem
                      icon={<CloseIcon />}
                      onClick={() => {
                        signOut({ redirect: false }).then(() => {
                          router.push("/");
                        });
                      }}
                    >
                      Log out
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <button onClick={() => signIn()}>Sign in</button>
              </>
            )}
          </SkeletonText>
        </div>
      </div>
    </div>
  );
};
