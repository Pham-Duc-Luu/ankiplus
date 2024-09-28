import { cn } from '@/lib/utils';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from '@nextui-org/react';
import { DragControls, Reorder, useDragControls } from 'framer-motion';
import { useTranslations } from 'next-intl';

import {
  MdDeleteOutline,
  MdOutlineAddPhotoAlternate,
  MdOutlineDragHandle,
} from 'react-icons/md';
import { CiLock } from 'react-icons/ci';
import { flashCardDto } from '@/lib/api/collection.user.axios';
import { Card as ICard } from '@/app/[locale]/create/collection/page';
import { useState } from 'react';

export interface CreateCardProps extends Partial<flashCardDto> {
  className?: string;
  value: any;
  order: number;

  onChange?: (updatedCard: ICard) => void;
  onRemove: (position: number) => void;
}

const CreateCard = ({
  className,
  order,
  onChange,
  onRemove,
  front,

  value,
  back,
}: CreateCardProps) => {
  const t = useTranslations('collection.create.card');
  const controls = useDragControls();
  const [cardFront, setcardFront] = useState(front);
  const [cardBack, setcardBack] = useState(back);

  const handleUpdate = () => {
    if (onChange) onChange({ ...value, front: cardFront, back: cardBack });
  };

  return (
    <Reorder.Item
      value={value}
      dragListener={false}
      data-item-id={value.id}
      dragControls={controls}>
      <div className={cn(className, ' my-4')}>
        <Card className="">
          <CardHeader className="flex gap-3 justify-between items-center">
            <div className="flex flex-col">
              <p className="text-lg m-2">{order}</p>
            </div>
            <div className="flex justify-center items-center">
              <Button
                isIconOnly
                color="warning"
                variant="faded"
                className=" flex justify-center items-center"
                onClick={() => onRemove(value.id)}>
                <MdDeleteOutline size={20}></MdDeleteOutline>
              </Button>
              <div
                className=" p-2 cursor-move reorder-handle "
                onPointerDown={(e) => controls?.start(e)}>
                <MdOutlineDragHandle
                  size={30}
                  className="mr-4 "></MdOutlineDragHandle>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className=" flex flex-row gap-4 items-baseline p-8">
            <Input
              variant="underlined"
              labelPlacement="outside"
              label={t('front.title')}
              onBlur={handleUpdate} // Call onChange when input loses focus
              onChange={(e) => {
                setcardFront(e.target.value);
              }}
              onClear={() => setcardFront(undefined)}
              isClearable></Input>
            <Input
              isClearable
              variant="underlined"
              labelPlacement="outside"
              onBlur={handleUpdate} // Call onChange when input loses focus
              onChange={(e) => {
                setcardBack(e.target.value);
              }}
              onClear={() => setcardBack(undefined)}
              label={t('back.title')}></Input>
            <div>
              <Button
                color="warning"
                variant="bordered"
                endContent={<MdOutlineAddPhotoAlternate />}
                startContent={<CiLock color={'warning'} />}>
                {t('picture.title')}
              </Button>
            </div>
          </CardBody>
          {/* <Divider /> */}
          {/* <CardFooter>
          <Link
            isExternal
            showAnchorIcon
            href="https://github.com/nextui-org/nextui">
            Visit source code on GitHub.
          </Link>
        </CardFooter> */}
        </Card>
      </div>
    </Reorder.Item>
  );
};

export default CreateCard;
