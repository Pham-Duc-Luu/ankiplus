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
} from "@nextui-org/react";
import { FaPen } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useParams } from "next/navigation";
import { Card, setSelectedCard } from "@/store/collectionSlice";
import _ from "lodash";

export type TColumnKey = keyof Card | "action";
const renderCell =
  //   useCallback(
  (item: Card, columnKey: TColumnKey) => {
    const cellValue = item[columnKey as keyof Card];

    switch (columnKey) {
      case "action":
        return (
          <div className=" flex gap-2 justify-end group-hover:visible invisible">
            <Button isIconOnly size="sm" variant="bordered">
              <IoEyeOutline size={16} />
            </Button>
            <Button isIconOnly size="sm" variant="bordered" color="warning">
              <FaPen size={16} />
            </Button>
            <Button isIconOnly size="sm" variant="bordered" color="danger">
              <MdDeleteOutline size={16} />
            </Button>
          </div>
        );
      default:
        return (
          //   <div className=" truncate">
          <div className=" ">
            <p className=" text-left">{cellValue?.toString().slice(0, 100)}</p>
          </div>
          //   </div>
        );
    }
  };

export interface ICardsTableProps extends TableProps {
  cards?: Card[];
}
const CardsTable = ({ cards }: ICardsTableProps) => {
  const { collectionid } = useParams<{ collectionid: string }>();
  const { selectedCard } = useAppSelector(
    (state) => state.persistedReducer.collection
  );

  const dispatch = useAppDispatch();

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

  if (!cards) {
    return <></>;
  }

  return (
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
      <TableBody items={cards}>
        {(item) => (
          <TableRow
            key={item._id}
            className=" group  w-full"
            onClick={() => {}}
          >
            {(columnKey) => (
              <TableCell className=" overflow-hidden">
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CardsTable;
