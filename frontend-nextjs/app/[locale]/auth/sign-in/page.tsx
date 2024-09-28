'use client';
import { useToast } from '@/hooks/use-toast';
import { useProfileStore } from '@/hooks/useProfile';
import { useRouter } from '@/i18n/routing';
import { axiosApi, ISignInBody } from '@/lib/api/axios';
import { Button, Card, CircularProgress, Input, Link } from '@nextui-org/react';
import { AxiosError } from 'axios';
import { error } from 'console';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { mutate } from 'swr';

export default function IconCloudDemo() {
  const t = useTranslations('auth');
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const router = useRouter();
  const fetcher = (url: string, data: ISignInBody) =>
    axiosApi.signIn(data).then((res) => res.data);

  const { initProfile, profile } = useProfileStore((state) => state);
  const { toast } = useToast();
  // Call API via handleSubmit with SWR
  const handleSubmit = async () => {
    toast({
      title: (
        <div className=" flex justify-between items-center w-full">
          <p className=" text-xl font-bold flex-1 mr-2">We are sign you in</p>
        </div>
      ),
      action: <CircularProgress aria-label="Loading..." />,
    });

    if (email && password) {
      try {
        const endpoint = '/sign-in'; // API endpoint
        const body = { email, password };

        // Manually trigger the mutation using SWR
        const response = await mutate(endpoint, fetcher(endpoint, body), {
          optimisticData: null, // Optionally set optimistic data
          rollbackOnError: true, // Revert if there's an error
          populateCache: true, // Populate cache after request
          revalidate: false, // Don't revalidate automatically
        });

        if (response?.access_token) {
          localStorage.setItem('access_token', response?.access_token);
        }
        if (response?.refresh_token) {
          localStorage.setItem('access_token', response?.refresh_token);
        }

        const fetchProfile = await mutate('get-user-profile', () =>
          axiosApi.userApi.getProfile().then((res) => res.data)
        );

        toast({
          title: 'You have successfully logged in',
          variant: 'success',
        });

        if (fetchProfile) {
          console.debug(fetchProfile);

          initProfile(fetchProfile);
          router.push('/dashboard');
          return;
        }

        // Navigate to the dashboard upon successful login
      } catch (error) {
        console.error(error.stack);
        // ! this is for development purposes, no api calls
        router.push('/dashboard');
        // !
        if (error instanceof AxiosError) {
          if (error.response?.data?.message)
            toast({
              title: error.response?.data?.message,
              variant: 'destructive',
            });
        }
        toast({
          title: 'Something went wrong',
          variant: 'destructive',
        });

        return;
      }
    } else {
      console.log('Please provide both email and password');
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
