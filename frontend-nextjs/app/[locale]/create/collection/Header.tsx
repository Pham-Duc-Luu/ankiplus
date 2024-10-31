"use client";
import { cn } from "@/lib/utils";
import { addCollectionInformation } from "@/store/createCollectionSlice";
import { useAppDispatch } from "@/store/hooks";
import { Button, Card, CardHeader, Input, Navbar } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { MdAddToPhotos } from "react-icons/md";

export interface IHeaderProps {
  className?: string;
  onChange?: (title: string, description?: string) => void;
}
const Header = ({ className, onChange }: IHeaderProps) => {
  const [title, settitle] = useState<string>();
  const [description, setdescription] = useState<string>();
  const dispatch = useAppDispatch();
  const t = useTranslations("collection.create");

  const handleUpdate = () => {
    if (onChange && title) onChange(title, description);

    dispatch(
      addCollectionInformation({ name: title, description: description })
    );
  };

  useEffect(() => {
    handleUpdate();
  }, [title, description]);
  return (
    <div className=" relative">
      <Card className={cn(className)}>
        <CardHeader className=" m-6 text-xl font-bold">
          {t("form.description")}
        </CardHeader>
        <Card className=" flex flex-col gap-4 m-6">
          <Input
            label={"Title"}
            onChange={(e) => {
              settitle(e.target.value);
            }}
            value={title}
            placeholder={t("form.title")}
            variant="bordered"
          ></Input>
          <Input
            value={description}
            label={"Descreption"}
            onChange={(e) => {
              setdescription(e.target.value);
            }}
            placeholder={t("form.title")}
            variant="bordered"
          ></Input>
        </Card>
      </Card>
    </div>
  );
};

export default Header;
