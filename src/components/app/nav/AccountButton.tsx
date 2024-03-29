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
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useColorMode,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { VscSettingsGear } from "react-icons/vsc";
import { useNavigate } from "react-router";
import { useAuth, useLogout } from "../../../lib/state/auth";
import { ThemeNameState } from "../../../lib/state/theme";
import { defaultThemes } from "../../../lib/theme";

const AccountButton = () => {
  const auth = useAuth();
  const logout = useLogout();
  const colorMode = useColorMode();
  const navigate = useNavigate();
  const [theme, setTheme] = useAtom(ThemeNameState);
  return (
    <Menu colorScheme={"brand"} variant={"unfilled"}>
      <MenuButton as={Button} colorScheme={"brand"} rightIcon={<ChevronDownIcon />}>
        <Flex alignItems="center">
          <Avatar size="sm" name={auth.session?.name} src={auth.session?.picture ?? ""} mr={2}></Avatar>
          {auth.session?.name}
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
        <MenuItem onClick={colorMode.toggleColorMode} closeOnSelect={false}>
          <Flex alignItems={"center"}>
            <Icon as={colorMode.colorMode === "dark" ? MdDarkMode : MdLightMode} w={4} h={4} mr={2} />{" "}
            {colorMode.colorMode === "dark" ? "Dark" : "Light"}
          </Flex>
        </MenuItem>
        <MenuDivider />
        <MenuOptionGroup
          title="Theme"
          value={theme}
          type="radio"
          onChange={(v) => {
            if (!v) return;
            console.log(typeof v === "string" ? v : v[0]);
            setTheme((typeof v === "string" ? v : v[0]) as keyof typeof defaultThemes);
          }}
        >
          {Object.entries(defaultThemes).map(([key, value]) => (
            <MenuItemOption closeOnSelect={false} key={key} value={key}>
              {key}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
        <MenuDivider />
        <MenuItem
          onClick={() => {
            navigate("/account");
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
