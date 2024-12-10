import { useRouter } from "@/i18n/routing";
import { useGetCollectionDetailQuery } from "@/store/graphql/COLLECTION.generated";
import { COLLECTION_LEARN } from "@/store/route.slice";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardProps,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React from "react";
import { PiCardsBold } from "react-icons/pi";

export interface CollectionheaderProps extends CardProps {}
const Collectionheader = ({}: CollectionheaderProps) => {
  const { collectionid } = useParams<{ collectionid: string }>();
  const route = useRouter();
  const useGetCollectionDetailQueryResult = useGetCollectionDetailQuery({
    ID: collectionid,
  });
  const t = useTranslations("collection");

  return (
    <Card>
      <CardHeader>
        <div>
          <p className=" text-4xl m-4 font-bold">
            {useGetCollectionDetailQueryResult.data?.getCollectionById.name}
          </p>
          <p className="  m-4 ">
            {
              useGetCollectionDetailQueryResult.data?.getCollectionById
                .description
            }
          </p>
        </div>
      </CardHeader>
      <CardFooter>
        <Button
          radius="sm"
          onClick={() => {
            route.push(COLLECTION_LEARN(collectionid));
          }}
          startContent={<PiCardsBold size={28} />}
          size="lg"
        >
          {t("info.function.review")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Collectionheader;
