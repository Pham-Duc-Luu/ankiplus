import { Badge } from "@nextui-org/react";
import React, { ReactNode } from "react";
import { FaLock } from "react-icons/fa";

const BadgeLock = ({ children }: { children: ReactNode }) => {
  return (
    <Badge isOneChar content={<FaLock />}>
      {children}
    </Badge>
  );
};

export default BadgeLock;
