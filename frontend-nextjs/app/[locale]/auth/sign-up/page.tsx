"use client";
import React from "react";
import { Button, Card, Input, InputProps, Link } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useSignUpMutation } from "@/store/RTK-query/authApi";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
const PasswordInput = (props: InputProps) => {
  const t = useTranslations("auth");
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      {...props}
      label={t("sign up.re password.label")}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
          {isVisible ? (
            <MdOutlineVisibilityOff className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <MdOutlineVisibility className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      placeholder={t("sign up.re password.placeholder")}
    />
  );
};

const ConfirmPasswordInput = (props: InputProps) => {
  const t = useTranslations("auth");
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      {...props}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
          {isVisible ? (
            <MdOutlineVisibilityOff className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <MdOutlineVisibility className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      label={t("sign up.re password.label")}
      placeholder={t("sign up.re password.placeholder")}
    />
  );
};
const Page = () => {
  const t = useTranslations("auth");
  const [useSignUpMutationTrigger, useSignUpMutationResult] =
    useSignUpMutation();
  const [credential, setcredential] = useState<
    Parameters<typeof useSignUpMutationTrigger>[0] & { confirmPassword: string }
  >();

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      <Card isFooterBlurred radius="lg" className="border-none p-6 lg:mx-32  ">
        <div className=" p-6 text-2xl  font-bold">{t("sign up.label")}</div>
        <div className=" flex flex-col gap-4 mb-6 ">
          <div className=" flex gap-4">
            <Input
              type="email"
              label={t("sign up.email.label")}
              placeholder={t("sign up.email.placeholder")}
            />
            <Input
              type="username"
              label={t("sign up.username.label")}
              placeholder={t("sign up.email.placeholder")}
            />
          </div>
          <PasswordInput
            value={credential?.confirmPassword}
            onChange={(e) =>
              setcredential({ ...credential, confirmPassword: e.target.value })
            }
          ></PasswordInput>
          <ConfirmPasswordInput></ConfirmPasswordInput>
          <Button color="primary">{t("sign up.action")}</Button>
          <div className=" flex w-full justify-center gap-4">
            <Button className=" flex-1">
              <FaGoogle />
            </Button>
            <Button className=" flex-1">
              <FaFacebook />
            </Button>
          </div>
        </div>
        <div className=" flex justify-between items-center">
          <Link href="#" underline="always">
            {t("sign up.action")}
          </Link>
          <Link href="#" underline="always">
            {t("forgotPassword.action")}
          </Link>
        </div>
      </Card>
    </>
  );
};

export default Page;
