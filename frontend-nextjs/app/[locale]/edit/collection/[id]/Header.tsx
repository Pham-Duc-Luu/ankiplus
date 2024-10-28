"use client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useGetCollectionDetailQuery } from "@/store/graphql/COLLECTION.generated";
import {
  Button,
  Card,
  CardHeader,
  Input,
  Navbar,
  Spinner,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdAddToPhotos } from "react-icons/md";
import { useDebounce } from "@uidotdev/usehooks";
import { useUpdateCollectionInformationMutation } from "@/store/RTK-query/collectionApi";
export interface IHeaderProps {
  className?: string;
  title?: string;
  description?: string;
  onChange?: (title: string, description?: string) => void;
}
const Header = ({ className, onChange }: IHeaderProps) => {
  const [title, settitle] = useState<string>();
  const { id } = useParams<{ id: string }>();
  const [description, setdescription] = useState<string>();
  const { data, isLoading, isError } = useGetCollectionDetailQuery({ ID: id });
  const t = useTranslations("collection.create");
  const debounceTitle = useDebounce(title, 1000);
  const debounceDescription = useDebounce(description, 1000);

  const [
    updateCollectionInformationMutation,
    updateCollectionInformationResult,
  ] = useUpdateCollectionInformationMutation();
  const handleUpdate = () => {
    if (onChange && title) onChange(title, description);
  };

  useEffect(() => {
    handleUpdate();
  }, [title, description]);

  useEffect(() => {
    isError &&
      toast({
        title: "There is something when fetching title",
        variant: "destructive",
      });
  }, [isError]);

  useEffect(() => {
    if (data?.getCollectionById) {
      settitle(data.getCollectionById.name);
      setdescription(data.getCollectionById.description);
    }
  }, [data?.getCollectionById]);

  useEffect(() => {
    if (debounceTitle) {
      updateCollectionInformationMutation({
        id,
        parameters: { name: debounceTitle },
      });
    }
  }, [debounceTitle]);

  return (
    <div className=" relative">
      <Card className={cn(className)}>
        {/* <CardHeader className=" m-6 text-xl font-bold">
          {t("form.description")}
        </CardHeader> */}
        <Card
          className={cn(" flex flex-col gap-4 m-6", isLoading && "cursor-wait")}
        >
          <Input
            label={"Title"}
            size="lg"
            isDisabled={isLoading}
            value={title}
            className=" cursor-wait"
            endContent={isLoading && <Spinner></Spinner>}
            onChange={(e) => {
              settitle(e.target.value);
            }}
            placeholder={t("form.title")}
            variant="flat"
          ></Input>
          <Input
            label={"Descreption"}
            size="lg"
            value={description}
            isDisabled={isLoading}
            endContent={isLoading && <Spinner></Spinner>}
            onChange={(e) => {
              setdescription(e.target.value);
            }}
            placeholder={t("form.title")}
          ></Input>
        </Card>
      </Card>
    </div>
  );
};

export default Header;
