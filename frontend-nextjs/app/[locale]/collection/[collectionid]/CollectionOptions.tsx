import BadgeLock from "@/components/BadgeLock";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import React from "react";
import { CiSettings } from "react-icons/ci";
import { AiOutlineEdit } from "react-icons/ai";

export interface CollectionOptions {
  className?: string;
}
const CollectionOptions = ({ className }: CollectionOptions) => {
  return (
    <div className={cn(className, " flex justify-center items-center gap-4")}>
      <BadgeLock>
        <Button radius="sm" variant="flat">
          <CiSettings size={28} />
        </Button>
      </BadgeLock>

      <Button radius="sm" variant="flat">
        <AiOutlineEdit size={28} />
      </Button>
    </div>
  );
};

export default CollectionOptions;
