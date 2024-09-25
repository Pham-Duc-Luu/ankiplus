import { cn } from '@/lib/utils';
import { Button, Card, CardHeader, Input, Navbar } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { MdAddToPhotos } from 'react-icons/md';
const Header = ({ className }: { className?: string }) => {
  const t = useTranslations('collection.create');
  return (
    <div className=" relative">
      <Card className={cn(className)}>
        <CardHeader className=" m-6 text-xl font-bold">
          {t('form.description')}
        </CardHeader>
        <Card className=" flex flex-col gap-4 m-6">
          <Input
            label={'Title'}
            placeholder={t('form.title')}
            variant="flat"></Input>
          <Input label={'Descreption'} placeholder={t('form.title')}></Input>
        </Card>
      </Card>
    </div>
  );
};

export default Header;
