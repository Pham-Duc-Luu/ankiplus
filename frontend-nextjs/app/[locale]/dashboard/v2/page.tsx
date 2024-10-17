"use client";
import CollectionCard, { ICollectionCard } from "@/components/CollectionCard";
import {
  Avatar,
  Button,
  ButtonProps,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownProps,
  DropdownTrigger,
  Input,
  InputProps,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdAddCircleOutline } from "react-icons/md";

export const IViewOptions = ["latest", "created"] as const;

const ViewOptions = ({ className }: Partial<ButtonProps>) => {
  const t = useTranslations("dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewOptions, setviewOptions] = useState<(typeof IViewOptions)[number]>(
    IViewOptions[0]
  );

  return (
    <Dropdown
      onOpenChange={(isOpen) => {
        setIsDropdownOpen(isOpen);
      }}
    >
      <DropdownTrigger>
        <Button
          className={className}
          variant="bordered"
          startContent={
            isDropdownOpen ? (
              <IoMdArrowDropup size={28} />
            ) : (
              <IoMdArrowDropdown size={28} />
            )
          }
        >
          {t(`view options.${viewOptions}`)}
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {IViewOptions.map((item, index) => {
          return (
            <DropdownItem
              key={index}
              onClick={() => {
                setviewOptions(item);
              }}
            >
              {item}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

const SearchBox = ({ className }: InputProps) => {
  return (
    <Input
      label="Search"
      isClearable
      radius="lg"
      className={className}
      classNames={{
        label: "text-black/50 dark:text-white/90",
        input: [
          "bg-transparent",
          "text-black/90 dark:text-white/90",
          "placeholder:text-default-700/50 dark:placeholder:text-white/60",
        ],
        innerWrapper: "bg-transparent",
        inputWrapper: [
          "shadow-xl",
          "bg-default-200/50",
          "dark:bg-default/60",
          "backdrop-blur-xl",
          "backdrop-saturate-200",
          "hover:bg-default-200/70",
          "dark:hover:bg-default/70",
          "group-data-[focus=true]:bg-default-200/50",
          "dark:group-data-[focus=true]:bg-default/60",
          "!cursor-text",
        ],
      }}
      placeholder="Type to search..."
      startContent={
        <CiSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
      }
    />
  );
};

import { IoIosAdd, IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useRouter } from "@/i18n/routing";
import { CiSearch } from "react-icons/ci";
import { useGetProfileQuery } from "@/store/RTK-query/userApi";
import { useAppSelector } from "@/store/hooks";
import ListCollectionDisplay from "../ListCollectionDisplay";
const Page = () => {
  const t = useTranslations("dashboard.my collection");
  const route = useRouter();
  const { data } = useGetProfileQuery({
    options: {
      limit: 10,
    },
  });

  const { user } = useAppSelector((state) => state.persistedReducer);

  useEffect(() => {
    /**
     * TODO: unhighlight it after debugging
     */
    // if (!profile) {
    //   route.push("/auth/sign-in");
    // }
  }, []);

  return (
    <div className=" w-full min-h-screen flex flex-col items-center p-6">
      <div className=" lg:w-[1200px] w-full">
        <>
          <p className=" lg:text-2xl font-bold m-4">{t("title")}</p>
        </>
        <div className="lg:max-w-[1200px] flex flex-col gap-6">
          <div className="flex items-center justify-center">
            <div className=" flex-1">
              <ViewOptions className=" flex-1"></ViewOptions>
            </div>
            <SearchBox className=" flex-1"></SearchBox>
          </div>
          <Divider></Divider>

          <Card
            isPressable
            className="group/collectionCard cursor-pointer"
            onClick={() => {
              route.push("/create/collection");
            }}
          >
            <CardBody className=" p-4  w-full  flex items-center  flex-row gap-4">
              <Avatar
                isBordered
                color="default"
                fallback={<IoIosAdd size={40} />}
              ></Avatar>
              <h4 className="font-bold text-large">{t("create")}</h4>
            </CardBody>
            <CardFooter className="h-1 m-0 p-0 bg-[hsl(var(--primary))] group-hover/collectionCard:visible invisible"></CardFooter>
          </Card>
          {/* {user?.collections?.map((item, index) => {
            return (
              <CollectionCard key={index} title={item.name}></CollectionCard>
            );
          })} */}
          <ListCollectionDisplay></ListCollectionDisplay>
        </div>
      </div>
      {/* <Card className="flex-1">
        <CardBody className="lg:max-w-[1200px]">
          <CollectionCard {...example}></CollectionCard>
        </CardBody>
      </Card> */}
    </div>
  );
};

export default Page;
