import {
  Avatar,
  Button,
  ButtonProps,
  Card,
  CardBody,
  CardProps,
  Divider,
} from "@nextui-org/react";
import React, { useState } from "react";
import { MdOutlineNavigateNext } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";

export interface ICollectionCard {
  avatar: string;
  title: string;
  description: string;
  className?: string;
}
import { IoShareOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
export interface CollectionCardProps
  extends ButtonProps,
    Partial<ICollectionCard> {}
export default function CollectionCard({
  avatar,
  title,
  description,
  ...props
}: CollectionCardProps) {
  return (
    <>
      <Button
        {...props}
        className="py-10 m-4 group/collectionCard"
        variant="ghost"
      >
        <CardBody className=" flex flex-row items-center justify-center">
          <Avatar
            isBordered
            color="default"
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          />
          <CardBody>
            <h4 className="font-bold text-large">{title}</h4>
            <small className="text-default-500">{description}</small>
          </CardBody>
        </CardBody>
        <div className="flex gap-4 group-hover/collectionCard:visible invisible">
          <Button isIconOnly variant="light">
            <IoIosAddCircleOutline size={24} />
          </Button>
          <Button isIconOnly variant="light">
            <IoShareOutline size={24} />
          </Button>
          <Button isIconOnly variant="light" color="danger">
            <MdOutlineDeleteOutline size={24} />
          </Button>
        </div>
        <Button isIconOnly variant="light">
          <MdOutlineNavigateNext size={24} />
        </Button>
      </Button>
      {/* <Divider className="my-4" /> */}
    </>
  );
}
