import { Badge, BadgeProps, Button, ButtonProps } from "@nextui-org/react";
import React from "react";
import { FaLock } from "react-icons/fa";

const ButtonLockDisable = ({
  children,
  ...props
}: ButtonProps & BadgeProps) => {
  return (
    <div className=" cursor-not-allowed">
      <Badge isOneChar content={<FaLock />} variant="flat" color="warning">
        <Button isDisabled={true} {...props}>
          {children}
        </Button>
      </Badge>
    </div>
  );
};

export default ButtonLockDisable;
