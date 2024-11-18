"use client";
import React from "react";
import { Button, Card, Input, InputProps, Link } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useSignUpMutation } from "@/store/RTK-query/authApi";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { error } from "console";
// Define the Zod schema for form validation
const signUpSchema = z
  .object({
    username: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must be less than 50 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password must be less than 100 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
const PasswordInput = ({ ...props }: InputProps) => {
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
    />
  );
};

const ConfirmPasswordInput = (props: InputProps) => {
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
  const [isVisible, setIsVisible] = useState<{
    password: boolean;
    confirmPassword: boolean;
  }>({ password: false, confirmPassword: false });
  // Toggle function
  const toggleVisibility = (field: "password" | "confirmPassword") => {
    setIsVisible((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof signUpSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <>
      <Card isFooterBlurred radius="lg" className="border-none p-6 lg:mx-32  ">
        <div className=" p-6 text-2xl  font-bold">{t("sign up.label")}</div>
        <form
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(onSubmit);
            }
          }}
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className=" flex flex-col gap-4 mb-6"
        >
          <div className=" flex gap-4">
            <Input
              type="text"
              autoComplete="off"
              {...register("username")}
              label={t("sign up.username.label")}
              isInvalid={errors.username && true}
              errorMessage={errors.username?.message}
              placeholder={t("sign up.username.placeholder")}
            />
            <Input
              isInvalid={errors.email && true}
              errorMessage={errors.email?.message}
              autoComplete="off"
              type="email"
              {...register("email")}
              label={t("sign up.email.label")}
              placeholder={t("sign up.email.placeholder")}
            />
          </div>
          <Input
            {...register("password")}
            errorMessage={errors.password?.message}
            autoComplete="off"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => toggleVisibility("password")}
                aria-label="toggle password visibility"
              >
                {isVisible.password ? (
                  <MdOutlineVisibilityOff className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <MdOutlineVisibility className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible.password ? "text" : "password"}
            isInvalid={errors.password && true}
            label={t("sign up.password.label")}
          />
          <Input
            errorMessage={errors.confirmPassword?.message}
            isInvalid={errors.confirmPassword && true}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => toggleVisibility("confirmPassword")}
                aria-label="toggle password visibility"
              >
                {isVisible.confirmPassword ? (
                  <MdOutlineVisibilityOff className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <MdOutlineVisibility className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible.confirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            autoComplete="off"
            label={t("sign up.re password.label")}
          />
          <Button color="primary" type="submit">
            {t("sign up.action")}
          </Button>
        </form>
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
