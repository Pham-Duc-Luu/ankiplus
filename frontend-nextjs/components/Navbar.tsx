"use client";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import SparklesText from "./magicui/sparkles-text";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
  NavbarBrandProps,
  NavbarProps,
} from "@nextui-org/react";
import { useRouter } from "@/i18n/routing";
import { CiDark, CiLight } from "react-icons/ci";
import { useTheme } from "next-themes";
import ThemSwitch from "./ThemSwitch";
import { useTranslations } from "next-intl";
import DropdownAvatar from "./DropdownAvatar";
import { useAppSelector } from "@/store/hooks";
const MainNavbar = (navbarProps: NavbarProps) => {
  const router = useRouter();
  const t = useTranslations("dashboard.my collection");
  const { auth } = useAppSelector((state) => state.persistedReducer);
  const Tutils = useTranslations("utils");

  return (
    <Navbar
      isBordered
      {...navbarProps}
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
      <NavbarContent justify="start">
        <NavbarBrand
          className="mr-4  cursor-pointer"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          {/* <AcmeLogo />
          <p className="hidden sm:block font-bold text-inherit">ACME</p> */}

          <SparklesText
            text="Ankiplus+"
            sparklesCount={4}
            className=" text-xl"
          ></SparklesText>
        </NavbarBrand>
        <NavbarContent>
          <NavbarItem isActive>
            <Link href="#" aria-current="page" color="primary">
              {t("title")}
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent className="hidden sm:flex gap-3" justify="end">
          {auth?.access_token ? (
            <DropdownAvatar></DropdownAvatar>
          ) : (
            <Button
              size="lg"
              variant="bordered"
              onClick={() => {
                router.push("/auth/sign-in");
              }}
            >
              {Tutils("sign in")}
            </Button>
          )}
        </NavbarContent>
      </NavbarContent>
    </Navbar>
  );
};

export default MainNavbar;
