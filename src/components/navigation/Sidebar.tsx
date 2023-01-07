import { Container, CSS, Link, Text } from "@nextui-org/react";
import React, { ReactNode } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

export interface SidebarProps {
  title: ReactNode;
  children?: ReactNode;
  css?: CSS;
}

export const Sidebar = ({ title, children, css }: SidebarProps) => {
  return (
    <Container as="aside" css={{
      w: 250,
      pt: "$10",
      ...css,
    }}>
      <Text h2>{title}</Text>
      <div>
        {children}
      </div>
    </Container>
  );
}

export interface SidebarLinkProps {
  href: string;
  children?: ReactNode;
}

export const SidebarLink = ({ href, children }: SidebarLinkProps) => {
  const router = useRouter();

  const isActive = router.asPath.startsWith(href);

  return (
    <NextLink href={href} passHref legacyBehavior>
      <Link
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
    </NextLink>
  )
}
