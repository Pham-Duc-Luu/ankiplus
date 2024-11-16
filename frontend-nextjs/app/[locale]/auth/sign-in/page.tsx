"use client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { axiosApi, ISignInBody } from "@/lib/api/axios";
import { setAccessToken, setRefreshToken } from "@/store/authSilce";
import { ErrResponse } from "@/store/dto/error.res.dto";
import { useAppDispatch } from "@/store/hooks";
import {
  useGoogleOAuth2Mutation,
  useSignUpMutation,
} from "@/store/RTK-query/authApi";
import { Button, Card, CircularProgress, Input, Link } from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { error } from "console";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { signIn, useSession } from "next-auth/react";
import { getCookies } from "cookies-next";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,

  //   googleLogout,
} from "@react-oauth/google";

export default function IconCloudDemo() {
  const GoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);

      useGoogleOAuth2MutationTrigger(tokenResponse.code);
    },
    onError: (error) => console.log(error),
    scope: "",
  });

  const t = useTranslations("auth");
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const [useSignUpMutationTrigger, useSignUpMutationResult] =
    useSignUpMutation();

  const [useGoogleOAuth2MutationTrigger, useGoogleOAuth2MutationResult] =
    useGoogleOAuth2Mutation();

  const handleSubmit = () => {
    if (email && password) {
      useSignUpMutationTrigger({ email: email, password: password });
    }
  };

  /**
   * * capture the change event from the sign in mutation
   */
  useEffect(() => {
    /**
     * if the response is error
     */
    if (
      useSignUpMutationResult.isError &&
      useSignUpMutationResult.error?.data
    ) {
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

      router.push("/dashboard/v2");
    }
  }, [useSignUpMutationResult]);

  /**
   * * capture the change event from the sign in mutation
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

      router.push("/dashboard/v2");
    }
  }, [useGoogleOAuth2MutationResult]);
  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSubmit();
        }
      }}
    >
      <Card isFooterBlurred radius="lg" className="border-none p-6 lg:mx-32  ">
        <div className=" p-6 text-2xl  font-bold">{t("sign in.label")}</div>
        <div className=" flex flex-col gap-4 mb-6 ">
          <Input
            onChange={(e) => {
              setemail(e.target.value);
            }}
            value={email}
            type="email"
            label={t("sign in.email.label")}
            placeholder={t("sign in.email.placeholder")}
          />
          <Input
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            value={password}
            type="password"
            label={t("sign in.password.label")}
            placeholder={t("sign in.password.placeholder")}
          />
          <Button onClick={(e) => handleSubmit()} color="secondary">
            {t("sign in.action")}
          </Button>
          <div className=" flex w-full justify-center gap-4">
            <Button className=" flex-1" onClick={() => GoogleLogin()}>
              <FaGoogle />
            </Button>
            <Button className="flex-1">
              <FaFacebook />
            </Button>
          </div>
        </div>
        <div className=" flex justify-between items-center">
          <Link href={""} underline="always">
            {t("sign up.action")}
          </Link>
          <Link href="#" underline="always">
            {t("forgotPassword.action")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
