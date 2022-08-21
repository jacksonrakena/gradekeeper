import { ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar, Button, Flex, Icon, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, useColorMode } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import router from "next/router";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { VscSettingsGear } from "react-icons/vsc";

const AccountButton = (props: { session: Session }) => {
  const session = props.session;
  const colorMode = useColorMode();
  return (
    <Menu colorScheme={"brand"} variant={"unfilled"}>
      <MenuButton as={Button} colorScheme={"brand"} rightIcon={<ChevronDownIcon />}>
        <Flex alignItems="center">
          <Avatar size="sm" name={session.user?.name ?? ""} src={session.user?.image ?? ""} mr={2}></Avatar>
          {session.user?.name}
        </Flex>
      </MenuButton>
      <MenuList overflow={"hidden"}>
        <MenuItem onClick={() => router.push("/")}>
          <Flex alignItems={"center"}>
            <Icon w={4} h={4} as={AiOutlineHome} mr={2} /> Home
          </Flex>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={colorMode.toggleColorMode} closeOnSelect={false}>
          <Flex alignItems={"center"}>
            <Icon as={colorMode.colorMode === "dark" ? MdDarkMode : MdLightMode} w={4} h={4} mr={2} />{" "}
            {colorMode.colorMode === "dark" ? "Dark" : "Light"}
          </Flex>
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onClick={() => {
            router.push("/account");
          }}
        >
          <Flex alignItems={"center"}>
            <Icon w={4} h={4} as={VscSettingsGear} mr={2} /> My account
          </Flex>
        </MenuItem>
        <MenuDivider />
        <MenuGroup>
          {" "}
          <MenuItem
            onClick={() => {
              signOut({ redirect: false }).then(() => {
                router.push("/");
              });
            }}
            textColor={"red.500"}
            fontWeight={"semibold"}
          >
            <Flex alignItems={"center"}>
              <Icon w={5} h={5} as={IoIosLogOut} mr={2} />
              Log out
            </Flex>
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default AccountButton;
