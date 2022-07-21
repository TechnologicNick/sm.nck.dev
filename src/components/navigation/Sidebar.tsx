import { Container, Link, Text } from "@nextui-org/react";
import React, { ReactNode } from "react";
import { useHref, useLinkClickHandler, useLocation, useResolvedPath } from "react-router-dom";

export interface SidebarProps {
  title: ReactNode;
  children?: ReactNode;
}

export const Sidebar = ({ title, children }: SidebarProps) => {
  return (
    <Container as="aside" css={{
      w: 250,
      pt: "$10",
    }}>
      <Text h2>{title}</Text>
      <div>
        {children}
      </div>
    </Container>
  );
}

export interface SidebarLinkProps {
  to: string;
  children?: ReactNode;
}

export const SidebarLink = ({ to, children }: SidebarLinkProps) => {
  const href = useHref(to);
  const handleClick = useLinkClickHandler(to);
  const location = useLocation();
  const path = useResolvedPath(to);

  const locationPathname = location.pathname.toLowerCase();
  const toPathname = path.pathname.toLowerCase();

  const isActive = locationPathname === toPathname || locationPathname.startsWith(toPathname + "/");

  return (
    <Link
      href={href}
      onClick={handleClick}
      block
      aria-current={isActive ? "page" : undefined}
      color="text"
      css={{
        display: "block",
        color: isActive ? "$text" : "$gray700",
        fontWeight: isActive ? "$semibold" : "$normal",
        paddingLeft: "$10",
        position: "relative",
        "&::before": {
          content: "",
          width: "$2",
          height: "$2",
          borderRadius: "50%",
          backgroundColor: isActive ? "$text" : "$gray700",
          position: "absolute",
          left: "$5",
          top: "calc(50% - $2 / 2)",
        }
      }}
    >
      {children}
    </Link>
  )
}
