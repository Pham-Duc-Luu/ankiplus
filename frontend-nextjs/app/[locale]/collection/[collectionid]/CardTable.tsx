import { useCollection } from "@/hooks/useCollection";
import { Card } from "@/hooks/useCreateCollection";
import { selectCardByIndex } from "@/store/collectionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";

export type TColumnKey = keyof Card | "action";
export default function CardsTable() {
  const { cards, selectedCardIndex } = useAppSelector(
    (state) => state.collection
  );

  const dispatch = useAppDispatch();
  if (!cards) {
    return <></>;
  }
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
          return cellValue;
      }
    };
  //    []);

  return (
    <Table
      aria-label="Example static collection table"
      selectionMode="single"
      selectedKeys={new Set([`${selectedCardIndex + 1}`])}
      onSelectionChange={(e: Set<string>) => {
        if (e.values().next().value) {
          dispatch(selectCardByIndex(e.values().next().value - 1));
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
          <TableRow key={item._id} className=" group" onClick={() => {}}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
