'use client';
import CollectionCard, { ICollectionCard } from '@/components/CollectionCard';
import { Avatar, Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { MdAddCircleOutline } from 'react-icons/md';

const example: ICollectionCard = {
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  title: 'Example title',
  description: 'Example description',
};

import { IoIosAdd } from 'react-icons/io';
import { useRouter } from '@/i18n/routing';
import { useProfileStore } from '@/hooks/useProfile';
const Page = () => {
  const { profile } = useProfileStore();
  const t = useTranslations('dashboard.my collection');
  const route = useRouter();

  if (!profile) {
    route.push('auth/sign-in');
  }

  return (
    <div className=" w-full min-h-screen flex flex-col items-center p-6">
      <Card className=" lg:w-[1200px] w-full">
        <CardHeader>
          <p className=" lg:text-2xl font-bold m-4">{t('title')}</p>
        </CardHeader>
        <CardBody className="lg:max-w-[1200px]">
          <Button className="py-10 m-4" variant="ghost">
            <CardBody
              className=" flex flex-row items-center justify-center"
              onClick={() => {
                route.push('/create/collection');
              }}>
              <Avatar
                isBordered
                color="default"
                fallback={<IoIosAdd size={40} />}></Avatar>
              <CardBody>
                <h4 className="font-bold text-large">{t('create')}</h4>
              </CardBody>
            </CardBody>
          </Button>
          {profile?.collections?.map((item, index) => (
            <CollectionCard key={index} title={item.name}></CollectionCard>
          ))}
        </CardBody>
      </Card>
      {/* <Card className="flex-1">
        <CardBody className="lg:max-w-[1200px]">
          <CollectionCard {...example}></CollectionCard>
        </CardBody>
      </Card> */}
    </div>
  );
};

export default Page;
