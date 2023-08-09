import { Col, Row, Tooltip, styled, TooltipColors, CSS } from "@nextui-org/react";
import React, { ReactElement, ReactNode, useRef } from "react";
import { AriaButtonProps } from "@react-types/button";
import { useButton } from "@react-aria/button";
import { Icon, AvailableIcons } from "./Icons";
import { ModalProps } from "../../Modals";

const StyledIconButton = styled("button", {
  dflex: "center",
  border: "none",
  outline: "none",
  cursor: "pointer",
  p: "0",
  m: "0",
  bg: "transparent",
  color: "$gray500",
  transition: "$default",
  "&:hover": {
    opacity: "0.8"
  },
  "&:active": {
    opacity: "0.6"
  }
});

export const IconButton = (props: Parameters<typeof StyledIconButton>[0] & AriaButtonProps<"button">) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton({ ...props }, ref);

  // Fix "Unknown event handler property `onPress`. It will be ignored." warning
  const propsCopy = { ...props };
  delete propsCopy.onPress;
  
  return (
    <StyledIconButton {...buttonProps} {...propsCopy} ref={ref} />
  );
}

export interface ActionProps {
  tooltip?: ReactNode;
  color?: TooltipColors;
  onClick?: () => void;
  children?: ReactNode;
  icon?: AvailableIcons;
  modal?: ReactElement;
  css?: CSS;
}

export const Action = ({ tooltip, color, onClick, children, icon, modal, css }: ActionProps) => {
  const OptionalTooltip = tooltip ? (Tooltip as typeof Tooltip & React.FC<{ disabled: boolean }>) : React.Fragment;
  const modalRef: ModalProps["modalRef"] = useRef<any>();

  return (
    <Col css={{ d: "flex", ...css }}>
      {modal && React.cloneElement(modal, { modalRef })}
      <OptionalTooltip content={tooltip} color={color} disabled>
        <IconButton onPress={() => {
          onClick?.();
          modalRef.current?.setVisible(true);
        }}>
          {icon && <Icon icon={icon} size={20} focusable={false} />}
          {children}
        </IconButton>
      </OptionalTooltip>
    </Col>
  );
}

export interface ActionsCellProps {
  children: ReactNode;
}

const ActionsCell = ({ children }: ActionsCellProps) => {
  return (
    <Row justify="center" align="center">
      {children}
    </Row>
  );
}

export default ActionsCell