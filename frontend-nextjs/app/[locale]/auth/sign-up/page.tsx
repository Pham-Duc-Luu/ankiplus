'use client';
import React from 'react';
import { Button, Card, Input, Link } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
const Page = () => {
  const t = useTranslations('auth');

  return (
    <>
      <Card isFooterBlurred radius="lg" className="border-none p-6 lg:mx-32  ">
        <div className=" p-6 text-2xl  font-bold">{t('sign up.label')}</div>
        <div className=" flex flex-col gap-4 mb-6 ">
          <div className=" flex gap-4">
            <Input
              type="email"
              label={t('sign up.email.label')}
              placeholder={t('sign up.email.placeholder')}
            />
            <Input
              type="username"
              label={t('sign up.username.label')}
              placeholder={t('sign up.email.placeholder')}
            />
          </div>
          <Input
            type="password"
            label={t('sign up.password.label')}
            placeholder={t('sign up.password.placeholder')}
          />
          <Input
            type="password"
            label={t('sign up.re password.label')}
            placeholder={t('sign up.re password.placeholder')}
          />
          <Button color="primary">{t('sign up.action')}</Button>
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
            {t('sign up.action')}
          </Link>
          <Link href="#" underline="always">
            {t('forgotPassword.action')}
          </Link>
        </div>
      </Card>
    </>
  );
};

export default Page;
