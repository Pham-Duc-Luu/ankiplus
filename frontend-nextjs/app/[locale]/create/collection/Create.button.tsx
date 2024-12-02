"use client";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { DASHBOARD_ROUTE } from "@/store/route.slice";
import { useCreateNewCollectionMutation } from "@/store/RTK-query/collectionApi";
import { Button, ButtonProps, Spinner } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { MdAddToPhotos } from "react-icons/md";

const CreateButton = ({ ...props }: ButtonProps) => {
  const t = useTranslations("collection.create");
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [
    useCreateNewCollectionMutationTrigger,
    useCreateNewCollectionMutationResult,
  ] = useCreateNewCollectionMutation();
  const mutationtrigger = useAppSelector(
    (state) => state.collectionApi.mutations["createNewCollectionMutaion"]
  );

  const router = useRouter();
  useEffect(() => {
    if (useCreateNewCollectionMutationResult.isLoading) {
      toast({
        variant: "default",

        title: (
          <div className=" flex justify-center items-center gap-4">
            <Spinner></Spinner> <span>{t("function.pending")}</span>
          </div>
        ),
        // description: 'There was a problem with your request.',
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    if (useCreateNewCollectionMutationResult.isSuccess) {
      toast({
        variant: "success",

        title: "created",
        // description: 'There was a problem with your request.',
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      router.push(DASHBOARD_ROUTE());
    }
  }, [useCreateNewCollectionMutationResult]);

  return (
    <>
      <Button
        color="success"
        onClick={() => {
          useCreateNewCollectionMutationTrigger({});
        }}
        variant="bordered"
        className="text-xl"
        startContent={<MdAddToPhotos size={20}></MdAddToPhotos>}
      >
        {t("function.create")}
      </Button>
    </>
  );
};

export default CreateButton;
