import { Avatar, DropdownSection } from "@nextui-org/react";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { CiDark, CiLight, CiLogout } from "react-icons/ci";
import { useTranslations } from "next-intl";
import { CgProfile } from "react-icons/cg";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { TiMessageTyping } from "react-icons/ti";
const DropdownAvatar = () => {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("navbar");
  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Avatar
            className=" cursor-pointer"
            isBordered
            color="primary"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
          <DropdownSection showDivider>
            <DropdownItem key="profile" startContent={<CgProfile size={28} />}>
              {t("drop drow options.profile")}
            </DropdownItem>
            <DropdownItem
              closeOnSelect={false}
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
              }}
              onClose={() => {}}
              key="new"
              startContent={
                theme === "light" ? <CiDark size={28} /> : <CiLight size={28} />
              }
            >
              {theme === "light"
                ? t("drop drow options.theme.dark")
                : t("drop drow options.theme.light")}
            </DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider>
            <DropdownItem key="log out" startContent={<CiLogout size={28} />}>
              {t("drop drow options.log out")}
            </DropdownItem>
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              key="help"
              startContent={<IoMdHelpCircleOutline size={28} />}
            >
              {t("drop drow options.help")}
            </DropdownItem>
            <DropdownItem
              key="response"
              startContent={<TiMessageTyping size={28} />}
            >
              {t("drop drow options.response")}
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default DropdownAvatar;
