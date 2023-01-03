import { Dropdown, Link, Navbar, Text, useTheme } from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FaDiscord, FaGithub, FaMoon, FaSun } from "react-icons/fa";
import { useInRouterContext, useNavigate } from "react-router-dom";

const SaveEditorDropdown = ({ isActive }: { isActive: boolean }) => {
  const isInRouterContext = useInRouterContext();
  const navigate = isInRouterContext ? useNavigate() : () => {};
  const router = useRouter();

  const handleNavigate = (key: string | number) => {
    if (isInRouterContext) {
      navigate(`${key}`);
    } else {
      router.push(`/save-editor/${key}`);
    }
  }

  return (
    <Dropdown isBordered>
      <Navbar.Item>
        <Dropdown.Button
          auto
          light
          css={{
            px: 0,
            dflex: "center",
            svg: { pe: "none" },
          }}
          // iconRight={icons.chevron}
          ripple={false}
        >
          <Navbar.Link isActive={isActive}>Save Editor</Navbar.Link>
        </Dropdown.Button>
      </Navbar.Item>
      <Dropdown.Menu
        aria-label="Save Editor features"
        onAction={handleNavigate}
        css={{
          $$dropdownMenuWidth: "340px",
          $$dropdownItemHeight: "70px",
          "& .nextui-dropdown-item": {
            height: "calc($$dropdownItemHeight * 1.2)",
            lineHeight: 1.2,
            px: "$0",
            // py: "$4",
            // Dropdown item left icon
            svg: {
              color: "$secondary",
              mr: "$4",
            },
            a: {
              display: "block",
              px: "$6",
              py: "$8",
            },
            // Dropdown item title
            "& .nextui-dropdown-item-content": {
              w: "100%",
              fontWeight: "$semibold",
            },
            "& .description": {
              fontSize: "$xs",
              color: "$$dropdownItemDescriptionColor",
              truncateText: "calc($$dropdownMenuWidth * 0.9)",
              transition: "color 0.12s ease 0s",
              maxWidth: "calc($$dropdownMenuWidth * 0.9)",
              lineHeight: 1.2,
              marginTop: "$2",
              overflow: "visible",
              whiteSpace: "normal",
              letterSpacing: "unset",
            },
            "&:hover .description": {
              color: "$$dropdownItemHoverTextColor",
            },
          },
        }}
      >
        <Dropdown.Item key="game" textValue="Game">
          <NextLink href="/save-editor/game" passHref>
            <Text b>Game</Text>
            <Text className="description">The game mode, seed, game tick and general information about the save file.</Text>
          </NextLink>
        </Dropdown.Item>
        <Dropdown.Item key="players" textValue="Players">
          <NextLink href="/save-editor/players" passHref>
            <Text b>Players</Text>
            <Text className="description">List of players in the save file, including their name, ID, and position.</Text>
          </NextLink>
        </Dropdown.Item>
        <Dropdown.Item key="mods" textValue="Mods">
          <NextLink href="/save-editor/mods" passHref>
            <Text b>Mods</Text>
            <Text className="description">All mods and custom game dependencies used in the save file.</Text>
          </NextLink>
        </Dropdown.Item>
        <Dropdown.Item key="worlds" textValue="Worlds">
          <NextLink href="/save-editor/worlds" passHref>
            <Text b>Worlds</Text>
            <Text className="description">Table of worlds in the save file, their scripts and script data.</Text>
          </NextLink>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

const MyNavbar = () => {
  const { asPath } = useRouter();
  const { isDark } = useTheme();
  const { setTheme } = useNextTheme();

  const getLinkProps = (href: string) => ({
    href,
    isActive: asPath.startsWith(href),
  });

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Navbar
      isCompact
      isBordered
      variant="sticky"
      css={{
        ".nextui-navbar-container": {
          maxWidth: "unset",
        },
      }}
    >
      <Navbar.Toggle showIn="xs" />
      <Navbar.Brand>
        <Text b color="inherit" hideIn="xs">
          <NextLink href="/" passHref legacyBehavior>
            <Link color="text">
              sm.nck.dev
            </Link>
          </NextLink>
        </Text>
      </Navbar.Brand>
      <Navbar.Content
        enableCursorHighlight
        hideIn="xs"
      >
        <SaveEditorDropdown {...getLinkProps("/save-editor")} />
        {/* <Navbar.Link {...getLinkProps("/about")}>About</Navbar.Link> */}
      </Navbar.Content>
      <Navbar.Content
        enableCursorHighlight
        hideIn="xs"
        css={{
          gap: "$6",
          "svg": {
            color: "$accents6",
            fontSize: "$xl",
          }
        }}
      >
        <Navbar.Link href="https://discord.gg/hM4rbyAc5K" target="_blank">
          <FaDiscord />
        </Navbar.Link>
        <Navbar.Link href="https://github.com/TechnologicNick/sm.nck.dev" target="_blank">
          <FaGithub />
        </Navbar.Link>
        <Navbar.Link
          as="button"
          onClick={toggleTheme}
          css={{
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          {isDark ? <FaSun /> : <FaMoon />}
        </Navbar.Link>
      </Navbar.Content>
    </Navbar>
  );
}

export default MyNavbar;
