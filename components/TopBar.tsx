import { ChevronDownIcon, CloseIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  SkeletonText,
  useColorMode,
  Button,
  MenuList,
  MenuItem,
  Text,
  Avatar,
  Flex,
  AvatarBadge,
} from "@chakra-ui/react";
import { Subject } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const TopBar = (props: { currentSubjectId?: string; otherSubjects?: Subject[] }) => {
  const sessiondata = useSession();
  const session = sessiondata.data;
  const router = useRouter();
  const cm = useColorMode();
  const currentSubject =
    props.otherSubjects && props.currentSubjectId ? props.otherSubjects.filter((d) => d.id === props.currentSubjectId)[0] : null;
  return (
    <div>
      <div className="w-full p-2 flex flex-row">
        <div className="grow">
          {props.otherSubjects && props.currentSubjectId && (
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
                {props.otherSubjects
                  ?.filter((e: Subject) => e.id !== props.currentSubjectId)
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
                        signOut();
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
