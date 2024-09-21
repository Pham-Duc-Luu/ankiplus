import type { MetaFunction } from '@remix-run/node';
import { Spinner } from '@nextui-org/spinner';
export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

import SparklesText from '@/components/magicui/sparkles-text';
import { useEffect, useState } from 'react';

import { redirect, useNavigate } from '@remix-run/react';

export default function OrbitingCirclesDemo() {
  const navigate = useNavigate();
  const [token, settoken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      // Redirect to the login page if the token doesn't exist
      navigate('/auth/sign-up');
    }
  }, [navigate]);

  return (
    <div className=" min-h-screen w-full flex justify-center items-center">
      <SparklesText text="Welcome to AnkiPlus+" className=" text-4xl" />
      <Spinner />
    </div>
  );
}
