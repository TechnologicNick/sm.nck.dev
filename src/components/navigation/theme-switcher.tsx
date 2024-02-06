"use client";

import { Link } from "@nextui-org/link";
import { PropsOf } from "@nextui-org/system";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeSwitcher = (props: PropsOf<typeof Link>) => {
  const { theme, setTheme } = useTheme();

  console.log(theme);

  // Update the state to show the correct icon on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || theme === "dark";

  return (
    <Link
      as={"button"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      {...props}
    >
      <FaSun className="hidden dark:block" />
      <FaMoon className="dark:hidden" />
    </Link>
  );
}

export default ThemeSwitcher;