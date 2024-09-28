'use client';
import { ToastAction } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useCreateCollection } from '@/hooks/useCreateCollection';
import { Button, ButtonProps } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { MdAddToPhotos } from 'react-icons/md';

const CreateButton = (props: ButtonProps) => {
  const t = useTranslations('collection.create');
  const create = useCreateCollection.use.createCollection();
  const { toast } = useToast();
  const { createCollection } = useCreateCollection();
  return (
    <>
      <Button
        color="success"
        onClick={() => {
          createCollection();
        }}
        // onClick={() =>
        //   toast({
        //     variant: 'success',
        //     title: 'Uh oh! Something went wrong.',
        //     // description: 'There was a problem with your request.',
        //     // action: <ToastAction altText="Try again">Try again</ToastAction>,
        //   })
        // }
        variant="bordered"
        className="text-xl"
        startContent={<MdAddToPhotos size={20}></MdAddToPhotos>}
        {...props}>
        {t('function.create')}
      </Button>
    </>
  );
};

export default CreateButton;
