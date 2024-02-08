"use client";

import { Button } from "@nextui-org/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Link } from "@nextui-org/link";
import { NavbarItem, NavbarMenuItem } from "@nextui-org/navbar";
import { PropsOf } from "@nextui-org/system";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { GoChevronDown } from "react-icons/go";

type NavigationLink = {
  key: string;
  textValue: string;
  description: string;
  href: string;
};

export const saveEditorDropdownItems = [
  {
    key: "game",
    textValue: "Game",
    description: "The game mode, seed, game tick and general information about the save file.",
    href: "/save-editor/game"
  },
  {
    key: "players",
    textValue: "Players",
    description: "List of players in the save file, including their name, ID, and position.",
    href: "/save-editor/players"
  },
  {
    key: "mods",
    textValue: "Mods",
    description: "All mods and custom game dependencies used in the save file.",
    href: "/save-editor/mods"
  },
  {
    key: "worlds",
    textValue: "Worlds",
    description: "Table of worlds in the save file, their scripts and script data.",
    href: "/save-editor/worlds"
  },
  {
    key: "containers",
    textValue: "Containers",
    description: "Inventories and items of all parts and players.",
    href: "/save-editor/containers"
  },
] as const satisfies NavigationLink[];

export const SaveEditorDropdown = () => {
  const pathname = usePathname();
  const isActive = pathname?.startsWith("/save-editor") ?? false;

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Button
            disableRipple
            className={clsx("p-0 bg-transparent data-[hover=true]:bg-transparent", isActive && "font-semibold")}
            endContent={<GoChevronDown />}
            radius="sm"
            variant="light"
            size="lg"
            color={isActive ? "primary" : "default"}
          >
            Save Editor
          </Button>
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="Save Editor"
        className="w-[340px]"
        classNames={{
          list: "grid [grid-auto-rows:1fr]"
        }}
        itemClasses={{
          base: "px-3 py-4",
          title: "font-semibold",
        }}
        items={saveEditorDropdownItems}
        disableAnimation
      >
        {
          (item) => (
            <DropdownItem
              key={item.key}
              textValue={item.textValue}
              description={item.description}
              href={item.href}
            >
              {item.textValue}
            </DropdownItem>
          )
        }
      </DropdownMenu>
    </Dropdown>
  );
}

type NavbarMenuLinkProps = {
  href: string;
  children: React.ReactNode;
  indentLevel?: number;
} & PropsOf<typeof NavbarMenuItem>;

const NavbarMenuLink = ({ href, children, indentLevel = 0, ...props }: NavbarMenuLinkProps) => {
  const pathname = usePathname();

  return (
    <NavbarMenuItem {...props}>
      <Link
        href={href}
        color={pathname === href ? "primary" : "foreground"}
        className={pathname === href ? "font-semibold" : ""}
        style={{ paddingLeft: `${indentLevel * 1.5}rem` }}
      >
        {children}
      </Link>
    </NavbarMenuItem>
  );
}

export const NavbarMenuLinks = () => {
  return (
    <>
      <NavbarMenuLink href="/">Home</NavbarMenuLink>
      <NavbarMenuLink href="/save-editor">Save Editor</NavbarMenuLink>
      {saveEditorDropdownItems.map((item) => (
        <NavbarMenuLink
          key={item.key}
          href={item.href}
          indentLevel={1}
        >
          {item.textValue}
        </NavbarMenuLink>
      ))}
    </>
  );
}