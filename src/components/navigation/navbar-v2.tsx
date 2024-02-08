import { Link } from "@nextui-org/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/navbar";
import { FaDiscord, FaGithub } from "react-icons/fa";
import ThemeSwitcher from "./theme-switcher";
import { NavbarMenuLinks, SaveEditorDropdown } from "./navbar-links";

const NavbarV2 = () => {
  return (
    <Navbar
      isBordered
      height="3.25rem"
    >
      <NavbarMenuToggle className="sm:hidden" />
      <NavbarBrand>
        <Link href="/" color="foreground" className="max-sm:hidden font-semibold">
          sm.nck.dev
        </Link>
      </NavbarBrand>
      <NavbarContent justify="center" className="max-sm:hidden">
        <SaveEditorDropdown />
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="flex">
          <Link href="https://discord.gg/hM4rbyAc5K" target="_blank" className="text-xl text-default-600 dark:text-default-500">
            <FaDiscord title="Join the Guild of Scrap Mechanic Modders Discord server" />
          </Link>
        </NavbarItem>
        <NavbarItem className="flex">
          <Link href="https://discord.gg/hM4rbyAc5K" target="_blank" className="text-xl text-default-600 dark:text-default-500">
            <FaGithub title="View the source code on GitHub" />
          </Link>
        </NavbarItem>
        <NavbarItem className="flex">
          <ThemeSwitcher className="text-xl text-default-600 dark:text-default-500" />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuLinks />
      </NavbarMenu>
    </Navbar>
  );
}

export default NavbarV2;