"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableProps,
  TableRow,
  Textarea,
} from "@nextui-org/react";
import { FaPen } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useParams } from "next/navigation";
import { Card, setSelectedCard } from "@/store/collectionSlice";
import _ from "lodash";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { useUpdateCollectionInformationMutation } from "@/store/RTK-query/collectionApi";
import {
  useDeleteFlashCardMutation,
  useUpdateFlashcardInformationMutation,
} from "@/store/RTK-query/flashcardApi";
import { useDebounce } from "@uidotdev/usehooks";
import { useGetFLashCardsInCollectionQuery } from "@/store/graphql/COLLECTION.modify";
export type TColumnKey = keyof Card | "action";
import { useFullscreen } from "@mantine/hooks";
export interface ICardsTableProps extends TableProps {
  cards?: Card[];
  refetchCard?: () => void;
}
const CardsTable = ({ cards, refetchCard }: ICardsTableProps) => {
  const { collectionid } = useParams<{ collectionid: string }>();
  const { selectedCard } = useAppSelector(
    (state) => state.persistedReducer.collection
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  const { data, isLoading, refetch, isFetching } =
    useGetFLashCardsInCollectionQuery({
      ID: collectionid,
    });

  const [updateflashCardTrigger, updateFlashCardResults] =
    useUpdateFlashcardInformationMutation();
  const [deleteFlashCardTrigger, deleteFlashCardResults] =
    useDeleteFlashCardMutation();

  const [front, setfront] = useState<string>();
  const [back, setback] = useState<string>();
  const [flashcardId, setflashcardId] = useState<string>();
  const debounceFront = useDebounce(front, 1000);
  const debounceBack = useDebounce(back, 1000);
  const columns: {
    key: TColumnKey;
    label: TColumnKey;
  }[] = [
    {
      key: "front",
      label: "front",
    },
    {
      key: "back",
      label: "back",
    },
    {
      key: "action",
      label: "action",
    },
  ];

  const renderCell =
    //   useCallback(
    (item: Card, columnKey: TColumnKey) => {
      const cellValue = item[columnKey as keyof Card];

      switch (columnKey) {
        case "action":
          return (
            <div className=" flex gap-2 justify-end group-hover:visible invisible">
              <Button
                isIconOnly
                size="sm"
                onClick={() => {
                  setfront(item.front);
                  setback(item.back);
                  setflashcardId(item._id?.toString());
                  onOpen();
                }}
                variant="bordered"
                color="warning"
              >
                <FaPen size={16} />
              </Button>
              <Button
                onClick={() => {
                  item._id &&
                    deleteFlashCardTrigger({
                      collectionId: collectionid,
                      flashcardId: item._id.toString(),
                    });
                }}
                isIconOnly
                size="sm"
                variant="bordered"
                color="danger"
              >
                <MdDeleteOutline size={16} />
              </Button>
            </div>
          );
        default:
          return <div className=" text-left">{cellValue?.toString()} </div>;
      }
    };

  useEffect(() => {
    if (updateFlashCardResults.isSuccess) {
      onClose();
      refetch();
    }
  }, [updateFlashCardResults.isSuccess]);
  useEffect(() => {
    deleteFlashCardResults.isSuccess && refetch();
  }, [deleteFlashCardResults.isSuccess]);
  return (
    <>
      <Table
        aria-label="Example static collection table"
        selectionMode="single"
        //   defaultSelectedKeys={["0"]}
        selectedKeys={new Set([`${selectedCard?._id}`])}
        onSelectionChange={(e) => {
          const KEY = e["anchorKey"] as string;
          const currSelectedCard = _.find(cards, (c) => {
            return c._id === KEY;
          });

          if (currSelectedCard) {
            dispatch(setSelectedCard(currSelectedCard));
          }
        }}
        // selectedKeys={[`${selectedCardIndex + 1}`]}
        // defaultSelectedKeys={[`${selectedCardIndex + 1}`]}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "action" ? "end" : "center"}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          isLoading={isFetching || isLoading}
          loadingContent={<Spinner label="Loading..." />}
          items={isFetching || isLoading ? [] : cards}
        >
          {(item) => (
            <TableRow
              key={item._id}
              className=" group  w-full"
              onClick={() => {}}
            >
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        size={"2xl"}
        isOpen={isOpen}
        onClose={() => onClose()}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader> */}
              <ModalBody className="p-8">
                <Textarea
                  label="front"
                  disabled={updateFlashCardResults.isLoading}
                  value={front}
                  onChange={(e) => {
                    setfront(e.target.value);
                  }}
                />
                <Textarea
                  label="back"
                  disabled={updateFlashCardResults.isLoading}
                  onChange={(e) => {
                    setback(e.target.value);
                  }}
                  value={back}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  disabled={updateFlashCardResults.isLoading}
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  disabled={updateFlashCardResults.isLoading}
                  color="primary"
                  onPress={() => {
                    flashcardId &&
                      front &&
                      back &&
                      updateflashCardTrigger({
                        collectionId: collectionid,
                        flashcardId: flashcardId,
                        front,
                        back,
                      });

                    updateFlashCardResults.isLoading && onClose();
                  }}
                >
                  {updateFlashCardResults.isLoading ? (
                    <Spinner color="warning"></Spinner>
                  ) : (
                    "Save"
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CardsTable;
