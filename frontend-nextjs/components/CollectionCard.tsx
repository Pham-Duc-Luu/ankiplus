import {
  Avatar,
  Button,
  ButtonProps,
  Card,
  CardBody,
  CardFooter,
  CardProps,
  Divider,
  Snippet,
  useDisclosure,
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
import { Tooltip } from "@nextui-org/tooltip";
import { useTranslations } from "next-intl";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const route = useRouter();
  const t_utils = useTranslations("utils");
  return (
    <>
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
            <Tooltip content={t_utils("add")} color="secondary" size="lg">
              <Button isIconOnly variant="light">
                <IoIosAddCircleOutline size={24} />
              </Button>
            </Tooltip>
            <Tooltip content={t_utils("edit")} color="secondary" size="lg">
              <Button
                isIconOnly
                variant="light"
                onClick={() => {
                  route.push(`/edit/collection/${_id}`);
                }}
              >
                <IoShareOutline size={24} />
              </Button>
            </Tooltip>
            <Tooltip content={t_utils("delete")} color="danger" size="lg">
              <Button
                isIconOnly
                variant="light"
                color="danger"
                onClick={onOpen}
              >
                <MdOutlineDeleteOutline size={24} />
              </Button>
            </Tooltip>
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

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Confirmation
              </ModalHeader>
              <ModalBody>
                <Button
                  isDisabled
                  className=" opacity-100"
                  color="danger"
                >{`Are you sure to delete the collection ${title}?`}</Button>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={onClose}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
