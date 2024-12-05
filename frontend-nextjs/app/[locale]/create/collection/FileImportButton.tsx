import FileDropzone from "@/components/cuicui/FileDropzone";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Button,
  CircularProgress,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React from "react";
import { IoIosAdd, IoMdAdd } from "react-icons/io";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

const FileImportButton = () => {
  const t = useTranslations("collection");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { toast } = useToast();
  return (
    <div className=" my-4">
      <Button startContent={<IoMdAdd size={28} />} onPress={onOpen} radius="sm">
        {t("create.function.import")}
      </Button>

      <Modal
        isDismissable={false}
        className=" lg:w-[500px] lg:h-[500px]"
        radius="sm"
        isOpen={isOpen}
        backdrop="blur"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className=" ">
                <FileDropzone onModalClose={() => onClose()}></FileDropzone>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="lg"
                  radius="sm"
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                >
                  {"cancel"}
                </Button>
                <Button
                  radius="sm"
                  size="lg"
                  startContent={<IoIosAdd />}
                  onPress={() => {
                    onClose();
                    toast({
                      duration: 1000,
                      variant: "default",

                      title: (
                        <div className=" flex justify-center items-center gap-4">
                          <Spinner></Spinner>{" "}
                          <span>File are being proccessed</span>
                        </div>
                      ),
                    });
                  }}
                  color="secondary"
                >
                  {t("create.function.import")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FileImportButton;
