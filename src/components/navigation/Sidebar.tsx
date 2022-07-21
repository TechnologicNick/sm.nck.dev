import { Container, Text } from "@nextui-org/react";
import React, { ReactNode } from "react";

export interface SidebarProps {
  title: ReactNode;
  children?: ReactNode
}

export const Sidebar = ({ title, children }: SidebarProps) => {
  return (
    <Container as="aside" css={{
      w: 250,
      pt: "$10",
    }}>
      <Text h4>{title}</Text>
      <div>
        {children}
      </div>
    </Container>
  );
}
