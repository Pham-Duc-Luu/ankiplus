"use client";
import React, { useEffect } from "react";
import {
  Button,
  Card,
  CircularProgress,
  Input,
  InputProps,
  Link,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import {
  useGoogleOAuth2Mutation,
  useSignUpMutation,
} from "@/store/RTK-query/authApi";
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
import { AxiosError } from "axios";
import { RTKqueryError } from "@/store/RTK-query/axios/axiosBaseQuery";
import { useToast } from "@/hooks/use-toast";
import { ErrResponse } from "@/store/dto/error.res.dto";
import { useGoogleLogin } from "@react-oauth/google";
import { setAccessToken, setRefreshToken } from "@/store/authSilce";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "@/i18n/routing";
import { AUTH_SIGN_IN, DASHBOARD_ROUTE } from "@/store/route.slice";
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
const Page = () => {
  const t = useTranslations("auth");
  const [useSignUpMutationTrigger, useSignUpMutationResult] =
    useSignUpMutation();

  const [useGoogleOAuth2MutationTrigger, useGoogleOAuth2MutationResult] =
    useGoogleOAuth2Mutation();
  const GoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);

      useGoogleOAuth2MutationTrigger(tokenResponse.code);
    },
    onError: (error) => console.log(error),
    scope: "",
  });
  const router = useRouter();

  const { toast } = useToast();
  const [credential, setcredential] = useState<
    Parameters<typeof useSignUpMutationTrigger>[0] & { confirmPassword: string }
  >();

  const dispatch = useAppDispatch();

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
    useSignUpMutationTrigger(values);
  }

  useEffect(() => {
    if (useSignUpMutationResult.error) {
      const error = useSignUpMutationResult.error
        .data as AxiosError<ErrResponse>;

      toast({ variant: "destructive", title: error?.message });
    }

    /**
     * if the sign up was successful
     */
    if (useSignUpMutationResult.data) {
      dispatch(setAccessToken(useSignUpMutationResult.data.access_token));
      dispatch(setRefreshToken(useSignUpMutationResult.data.refresh_token));
      toast({
        variant: "success",
        duration: 700,
        title: (
          <div className=" flex justify-center items-center gap-4">
            <CircularProgress aria-label="Loading..." />
            <p>You've signed up successful</p>
          </div>
        ),
      });

      router.push(DASHBOARD_ROUTE());
    }
  }, [useSignUpMutationResult]);

  /**
   * * SIGN UP GOOGLE
   */
  useEffect(() => {
    /**
     * if the response is error
     */
    if (
      useGoogleOAuth2MutationResult.isError &&
      useGoogleOAuth2MutationResult.error?.data
    ) {
      const error = useGoogleOAuth2MutationResult.error
        .data as AxiosError<ErrResponse>;

      toast({ variant: "destructive", title: error?.message });
    }

    /**
     * if the sign up was successful
     */
    if (useGoogleOAuth2MutationResult.data) {
      dispatch(setAccessToken(useGoogleOAuth2MutationResult.data.access_token));
      dispatch(
        setRefreshToken(useGoogleOAuth2MutationResult.data.refresh_token)
      );
      toast({
        variant: "success",
        duration: 700,
        title: (
          <div className=" flex justify-center items-center gap-4">
            <CircularProgress aria-label="Loading..." />
            <p>You've signed up successful</p>
          </div>
        ),
      });

      router.push(DASHBOARD_ROUTE());
    }
  }, [useGoogleOAuth2MutationResult]);

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
          <div className=" flex w-full justify-center gap-4">
            <Button className=" flex-1" onClick={() => GoogleLogin()}>
              <FaGoogle />
            </Button>
            <Button className="flex-1">
              <FaFacebook />
            </Button>
          </div>
        </form>
        <div className=" flex justify-between items-center">
          <Link
            href="#"
            underline="always"
            onPress={() => router.push(AUTH_SIGN_IN())}
          >
            {t("sign in.action")}
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
