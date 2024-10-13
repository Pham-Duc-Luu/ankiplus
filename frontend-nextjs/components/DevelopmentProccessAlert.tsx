import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useAppSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import { handleClose } from "@/store/modalSlice";

export default function DevelopmentProccessAlert() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const backdrops = ["opaque", "blur", "transparent"];

  const model = useAppSelector((state) => state.persistedReducer.model);
  const dispatch = useDispatch();
  return (
    <>
      <Modal
        backdrop={model.backdrops}
        isOpen={model.isOpen}
        onClose={() => {
          dispatch(handleClose());
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {model.moderHeader}
              </ModalHeader>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
