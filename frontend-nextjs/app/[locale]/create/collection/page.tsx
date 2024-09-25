'use client';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import Header from './Header';
import Functions from './Functions';
import CreateCard from '@/components/flashcard.create';
import { AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { removeItem } from '@/lib/utils';
import { MdAddToPhotos } from 'react-icons/md';

export default function Page() {
  const t = useTranslations('collection.create');
  const [items, setItems] = useState([0, 1, 2]);

  const add = () => {
    setItems([...items, items.length]);
  };

  const remove = (position: number) => {
    setItems(removeItem(items, position));

    // setItems([...items.splice(position, 1)]);
  };

  return (
    <div className=" w-full min-h-screen flex flex-col items-center p-6">
      <div className="lg:w-[1200px] mb-8">
        <Header></Header>
        {/* <Functions></Functions> */}
        <div>
          <Reorder.Group axis="y" values={items} onReorder={setItems}>
            {items.map((item, index) => (
              <CreateCard
                key={item}
                keyId={item}
                order={index}
                onRemove={remove}
                index={index}></CreateCard>
            ))}
          </Reorder.Group>
        </div>

        <div
          className=" cursor-pointer"
          onClick={() => {
            add();
          }}>
          <Card className=" flex justify-center items-center p-8  flex-row">
            <IoMdAdd size={30}></IoMdAdd>
            <p className=" text-xl font-bold">{t('card.add')}</p>
          </Card>
        </div>
        <div className="my-4 flex justify-end">
          <Button
            color="success"
            variant="bordered"
            className="text-xl"
            startContent={<MdAddToPhotos size={20}></MdAddToPhotos>}>
            {t('function.create')}
          </Button>
        </div>
      </div>
    </div>
  );
}
