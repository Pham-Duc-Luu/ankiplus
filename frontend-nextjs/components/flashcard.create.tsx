import { cn } from '@/lib/utils';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Link,
} from '@nextui-org/react';
import { DragControls, Reorder, useDragControls } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { HtmlHTMLAttributes } from 'react';
import {
  MdDeleteOutline,
  MdOutlineAddPhotoAlternate,
  MdOutlineDragHandle,
} from 'react-icons/md';
import { CiLock } from 'react-icons/ci';

const CreateCard = ({
  className,
  order,
  onRemove,
  keyId,
}: {
  className?: string;

  keyId?: number;
  order: number;
  index: number;
  onRemove: (position: number) => void;
}) => {
  const t = useTranslations('collection.create.card');
  const controls = useDragControls();

  return (
    <Reorder.Item
      key={keyId}
      value={keyId}
      dragListener={false}
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
                onClick={() => onRemove(order)}>
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
              isClearable></Input>
            <Input
              isClearable
              variant="underlined"
              labelPlacement="outside"
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
