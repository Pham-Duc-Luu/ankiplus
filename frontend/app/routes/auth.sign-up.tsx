// import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { Card, CardFooter, Image, Button } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useTranslation } from 'react-i18next';
import i18next from '~/i18next.server';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { Link } from '@nextui-org/link';

export default function IconCloudDemo() {
  let { t } = useTranslation('auth');

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
}
