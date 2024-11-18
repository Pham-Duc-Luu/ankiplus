"use client";
import SparklesText from "@/components/magicui/sparkles-text";
import { useRouter } from "@/i18n/routing";
import { axiosApi } from "@/lib/api/axios";
import { useAppDispatch } from "@/store/hooks";
import { DASHBOARD_ROUTE } from "@/store/route.slice";
import { useGetProfileQuery } from "@/store/RTK-query/userApi";
import { Spinner } from "@nextui-org/react";
import { useEffect, useLayoutEffect } from "react";
import { mutate } from "swr";

export default function HomePage() {
  const router = useRouter();

  // ! This is for api from backend
  // useEffect(() => {
  //   if (!localStorage.getItem('access_token')) {
  //     router.push('/auth/sign-in');
  //   }

  //   if (localStorage.getItem('access_token')) {
  //     mutate('get user profile', () =>
  //       axiosApi.userApi.getProfile().then((res) => res.data)
  //     )
  //       .then((res) => {
  //         if (res) {
  //           initProfile(res);

  //           router.push('/dashboard');
  //         }
  //       })
  //       .catch((err) => {
  //         router.push('/auth/sign-in');
  //       });
  //   }
  // }, [router]);

  useEffect(() => {
    router.push(DASHBOARD_ROUTE());
  }, []);

  const {} = useGetProfileQuery({});

  return (
    <div className=" min-h-screen w-full flex justify-center items-center">
      <SparklesText text="Welcome to AnkiPlus+" className=" text-4xl" />
      <Spinner />
    </div>
  );
}
