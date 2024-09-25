'use client';
import SparklesText from '@/components/magicui/sparkles-text';
import { useRouter } from '@/i18n/routing';
import { Spinner } from '@nextui-org/react';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      router.push('/auth/sign-in');
    }
  }, [router]);
  return (
    <div className=" min-h-screen w-full flex justify-center items-center">
      <SparklesText text="Welcome to AnkiPlus+" className=" text-4xl" />
      <Spinner />
    </div>
  );
}
