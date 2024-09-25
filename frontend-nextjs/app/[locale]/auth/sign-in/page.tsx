'use client';
import { useRouter } from '@/i18n/routing';
import { Button, Card, Input, Link } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

export default function IconCloudDemo() {
  const t = useTranslations('auth');
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const router = useRouter();

  const handleSubmit = () => {
    // Trigger the mutation
    console.log(email, password);

    if (email && password) {
      // ! handle login api
      // TODO: navigate to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div>
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
          <Button onClick={(e) => handleSubmit()} color="secondary">
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
          <Link href={''} underline="always">
            {t('sign up.action')}
          </Link>
          <Link href="#" underline="always">
            {t('forgotPassword.action')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
