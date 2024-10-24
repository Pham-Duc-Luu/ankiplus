import {
  Avatar,
  Button,
  ButtonProps,
  Card,
  CardBody,
  CardFooter,
  CardProps,
  Divider,
} from "@nextui-org/react";
import React, { useState } from "react";
import { MdOutlineNavigateNext } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";

export interface ICollectionCard {
  avatar: string;
  title: string;
  _id: string | number;
  description: string;
  className?: string;
}
import { IoShareOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useRouter } from "@/i18n/routing";
import { FaUser } from "react-icons/fa";
import { useAppDispatch } from "@/store/hooks";
import { setCollection } from "@/store/collectionSlice";
export interface CollectionCardProps
  extends CardProps,
    Partial<ICollectionCard> {}
export default function CollectionCard({
  avatar,
  title,
  description,
  _id,
  ...props
}: CollectionCardProps) {
  const dispatch = useAppDispatch();
  const route = useRouter();
  return (
    <Card className="group/collectionCard cursor-pointer" {...props}>
      <CardBody
        onClick={() => {
          dispatch(
            setCollection({ id: _id, name: title, description: description })
          );
          route.push(`/collection/${_id}`);
        }}
        className="  p-4  w-full  flex items-center  flex-row gap-4"
      >
        <div>
          <Avatar
            isBordered
            color="default"
            radius="full"
            fallback={<FaUser size={40} />}
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          />
        </div>
        <CardBody>
          <h4 className="font-bold text-large">{title}</h4>
          <small className="text-default-500 truncate">{description}</small>
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
        <Button
          isIconOnly
          variant="light"
          onClick={() => {
            route.push(`/collection/${_id}`);
          }}
        >
          <MdOutlineNavigateNext size={24} />
        </Button>
      </CardBody>

      {/* </Button> */}
      {/* <Divider className="my-4" /> */}
      <CardFooter className="h-1 m-0 p-0 bg-[hsl(var(--primary))] group-hover/collectionCard:visible invisible"></CardFooter>
    </Card>
  );
}
