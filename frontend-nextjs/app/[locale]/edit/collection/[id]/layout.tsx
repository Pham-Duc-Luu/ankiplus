import SideBar from "@/components/SideBar";
import { Button, Navbar } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React from "react";
import { MdAddToPhotos } from "react-icons/md";
import CreateButton from "./Create.button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("collection.create");

  return (
    <div className=" ">
      <Navbar
        className="my-4"
        classNames={{
          item: [
            "flex",
            "relative",
            "h-full",
            "items-center",
            "data-[active=true]:after:content-['']",
            "data-[active=true]:after:absolute",
            "data-[active=true]:after:bottom-0",
            "data-[active=true]:after:left-0",
            "data-[active=true]:after:right-0",
            "data-[active=true]:after:h-[2px]",
            "data-[active=true]:after:rounded-[2px]",
            "data-[active=true]:after:bg-primary",
          ],
        }}
      >
        <div className=" text-2xl font-bold">{t("title")}</div>
        {/* <CreateButton></CreateButton> */}
      </Navbar>
      <div>
        <>{children}</>
      </div>
    </div>
  );
}
