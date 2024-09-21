// import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { Card, CardFooter, Image, Button } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { json, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { useTranslation } from 'react-i18next';
import i18next from '~/i18next.server';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { Link } from '@nextui-org/link';
import { useHref } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { handle } from '~/root';
import { api } from '@/api/api';
import { AxiosError } from 'axios';

export default function IconCloudDemo() {
  let { t } = useTranslation('auth');
  const signUphref = useHref('/auth/sign-up');

  const [email, setemail] = useState();
  const [password, setpassword] = useState();

  const mutation = useMutation({
    mutationFn: (email: string, password: string) => {
      return api.users.signIn({ email, password });
    },
    onError(error, variables, context) {
      const err = error as AxiosError<{ message: string }>;
      console.log(err?.response?.data.message);
    },
    onSuccess(data, variables, context) {},
  });

  const handleSubmit = () => {
    // Trigger the mutation
    console.log(email, password);

    if (email && password) {
      mutation.mutate(email, password);
    }
  };

  // useEffect(() => {
  //   console.log(mutation.error);
  // }, [mutation]);
  return (
    <>
      <Card isFooterBlurred radius="lg" className="border-none p-6 lg:mx-32  ">
        <div className=" p-6 text-2xl  font-bold">{t('sign in.label')}</div>
        <div className=" flex flex-col gap-4 mb-6 ">
          <Input
            onChange={(e) => {
              setemail(e.target.value);
            }}
            value={email}
            type="email"
            label={t('sign in.email.label')}
            placeholder={t('sign in.email.placeholder')}
          />
          <Input
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            value={password}
            type="password"
            label={t('sign in.password.label')}
            placeholder={t('sign in.password.placeholder')}
          />
          <Button onClick={(e) => handleSubmit()} color="primary">
            {t('sign in.action')}
          </Button>
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
          <Link href={signUphref} underline="always">
            {t('sign up.action')}
          </Link>
          <Link href="#" underline="always">
            {t('forgotPassword.action')}
          </Link>
        </div>
      </Card>
    </>
  );
}
