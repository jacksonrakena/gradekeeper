import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlineHome } from "react-icons/ai";
import { FaRegChartBar } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { VscSettingsGear } from "react-icons/vsc";
import { useNavigate } from "react-router";
import { useLogout, useSession } from "../../../lib/state/auth";
import { LifetimeGpaModel } from "../dashboard/LifetimeGpaModal";

const AccountButton = () => {
  const session = useSession();
  const logout = useLogout();
  const colorMode = useColorMode();
  const navigate = useNavigate();
  const lifetimeGpaDisclosure = useDisclosure();
  return (
    <Menu>
      <LifetimeGpaModel disclosure={lifetimeGpaDisclosure} />
      <MenuButton as={Button} colorScheme={"brand"} rightIcon={<ChevronDownIcon />}>
        <Flex alignItems="center">
          <Avatar size="sm" name={session?.name} src={session?.picture ?? ""} mr={2}></Avatar>
          {session?.name}
        </Flex>
      </MenuButton>
      <MenuList overflow={"hidden"}>
        <MenuItem
          onClick={() => {
            navigate("/");
          }}
        >
          <Flex alignItems={"center"}>
            <Icon w={4} h={4} as={AiOutlineHome} mr={2} /> Home
          </Flex>
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onClick={() => {
            lifetimeGpaDisclosure.onOpen();
          }}
        >
          <Flex alignItems={"center"}>
            <Icon as={FaRegChartBar} w={4} h={4} mr={2} /> My GPAs
          </Flex>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={colorMode.toggleColorMode} closeOnSelect={false}>
          <Flex alignItems={"center"}>
            <Icon as={colorMode.colorMode === "dark" ? MdDarkMode : MdLightMode} w={4} h={4} mr={2} />{" "}
            {colorMode.colorMode === "dark" ? <>Dark mode</> : <>Light mode</>}
          </Flex>
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/account");
          }}
        >
          <Flex alignItems={"center"}>
            <Icon w={4} h={4} as={VscSettingsGear} mr={2} /> Settings
          </Flex>
        </MenuItem>
        <MenuDivider />
        <MenuGroup>
          {" "}
          <MenuItem
            onClick={() => {
              logout();
              navigate("/");
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
