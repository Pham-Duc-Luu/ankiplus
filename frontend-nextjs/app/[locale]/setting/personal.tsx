"use client";
import {
  Avatar,
  AvatarProps,
  Button,
  CardProps,
  Spinner,
} from "@nextui-org/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";

import Icon from "../../../public/emoji-motion/angry-bored-emoji-svgrepo-com.svg";
import EmojiMotionPage from "./emoji-motion";
import { GetStaticProps, NextPageContext } from "next";
import { getSvgFileNames } from "@/utils/readSvgFiles";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { XMLBuilder } from "fast-xml-parser";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTranslations } from "next-intl";
import { IoMdAdd } from "react-icons/io";
import { setAvatarByChooseIcon } from "@/store/userSlice";
import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import DevelopmentProccessAlert from "@/components/DevelopmentProccessAlert";
import { useDispatch } from "react-redux";
import { handleOpen } from "@/store/modalSlice";
import { useGetProfileQuery } from "@/store/RTK-query/userApi";
interface SvgFile {
  fileName: string;
  content: any;
}
const options = {
  ignoreAttributes: false,
};
const builder = new XMLBuilder(options);
export interface AvatarIconProps extends AvatarProps {
  data: any;
}

const AvatarIcon = ({ data, ...props }: AvatarIconProps) => {
  const { svg } = data;

  const dispatch = useAppDispatch();

  let xmlDataStr = builder.build(data);

  return (
    <ShadcnAvatar
      className=" cursor-pointer w-14 h-14"
      onClick={() => {
        dispatch(setAvatarByChooseIcon({ ...data }));
      }}
    >
      <AvatarFallback
        dangerouslySetInnerHTML={{ __html: xmlDataStr }}
      ></AvatarFallback>
    </ShadcnAvatar>
  );
};

export default function Personal({ ...prop }: CardProps) {
  const [svgFiles, setSvgFiles] = useState<SvgFile[]>([]);

  useEffect(() => {
    const fetchSvgs = async () => {
      try {
        const res = await fetch("/api/getAvatarIcon");
        if (res.ok) {
          const data = await res.json();
          setSvgFiles(data.svgs);
        } else {
          console.error("Failed to fetch SVGs");
        }
      } catch (error) {
        console.error("Error fetching SVGs:", error);
      }
    };

    fetchSvgs();
  }, []);
  const { user } = useAppSelector((state) => state.persistedReducer);
  const t = useTranslations("settings");
  const Tutils = useTranslations("utils");
  const dispatch = useDispatch();

  // fetch user profile
  const { isFetching, isError, data } = useGetProfileQuery({});

  if (isFetching) {
    <Spinner size="lg">loading...</Spinner>;
  }
  if (isError) {
    return <DevelopmentProccessAlert />;
  }

  return (
    <Card className="" {...prop}>
      <CardHeader className="flex gap-3 flex-col">
        <p className="w-full text-2xl font-sans px-10 py-4">
          {t("personal.change avatar")}
        </p>
        <div className=" flex w-full p-12 gap-12">
          <ShadcnAvatar className=" w-36 h-36">
            <AvatarFallback
              dangerouslySetInnerHTML={{ __html: user.avatarBuilt }}
            ></AvatarFallback>
          </ShadcnAvatar>

          <div className=" grid grid-cols-12 gap-4 flex-1">
            {svgFiles?.map((item, index) => {
              return (
                <AvatarIcon
                  size="lg"
                  className=" cursor-pointer"
                  data={item.content}
                ></AvatarIcon>
              );
            })}
            <Avatar
              size="lg"
              className=" cursor-pointer"
              icon={<IoMdAdd size={40} />}
            ></Avatar>
          </div>
        </div>
      </CardHeader>

      <Divider />
      <CardBody className="flex flex-row justify-center items-center p-10">
        <div className="flex flex-col flex-1">
          <p className=" text-xl font-bold">{Tutils("username")}</p>
          <p className=" text-xl">{data?.username}</p>
        </div>
        <Button
          variant="ghost"
          size="lg"
          onPress={() => {
            dispatch(handleOpen());
          }}
        >
          {Tutils("edit")}
        </Button>
      </CardBody>

      <Divider />
      <CardBody className="flex flex-row justify-center items-center p-10">
        <div className="flex flex-col flex-1">
          <p className=" text-xl font-bold">{Tutils("email")}</p>
          <p className=" text-xl">{data?.email}</p>
        </div>
        <Button
          variant="ghost"
          size="lg"
          onPress={() => {
            dispatch(handleOpen());
          }}
        >
          {Tutils("edit")}
        </Button>
      </CardBody>

      <Divider />
      <CardBody className="flex flex-row justify-center items-center p-10">
        <div className="flex flex-col flex-1">
          <p className=" text-xl font-bold">{Tutils("password")}</p>
          <p className=" text-xl">{user.password}</p>
        </div>
        <Button
          variant="ghost"
          size="lg"
          onPress={() => {
            dispatch(handleOpen());
          }}
        >
          {Tutils("edit")}
        </Button>
      </CardBody>
    </Card>
  );
}
