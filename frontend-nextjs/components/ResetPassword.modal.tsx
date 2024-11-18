import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalProps,
  Input,
  Link,
  Spinner,
} from "@nextui-org/react";
import { CiMail } from "react-icons/ci";
import { useTranslations } from "next-intl";
import {
  useResetPasswordMutation,
  useSendOtpMutation,
} from "@/store/RTK-query/authApi";
import { isValidEmail } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
const ResetPasswordButton = () => {
  const t = useTranslations("auth");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [email, setemail] = useState<string>();
  const [OTP, setOTP] = useState<string>();
  const [password, setpassword] = useState<string>();
  const [rePassword, setrePassword] = useState<string>();

  const [useSendOtpMutationTrigger, useSendOtpMutationResult] =
    useSendOtpMutation();
  const [useResetPasswordMutationTrigger, useResetPasswordMutationResult] =
    useResetPasswordMutation();

  const [errorEmailMessage, seterrorEmailMessage] = useState<string>();

  // send otp
  const sendOtpHandler = (email?: string) => {
    if (!email) {
      seterrorEmailMessage(t("forgotPassword.error message.required email"));
      return;
    }
    if (!isValidEmail(email)) {
      seterrorEmailMessage(t("forgotPassword.error message.invalid email"));
      return;
    }

    useSendOtpMutationTrigger({ email });

    seterrorEmailMessage(undefined);
    return;
  };

  useEffect(() => {
    useSendOtpMutationResult.isSuccess &&
      toast({
        variant: "success",
        duration: 1700,
        title: (
          <div className=" flex justify-center items-center gap-4">
            <p>{t("forgotPassword.error message.success")}</p>
          </div>
        ),
      });

    console.log(useSendOtpMutationResult);

    useSendOtpMutationResult.isError &&
      toast({
        variant: "destructive",
        duration: 1700,
        title: (useSendOtpMutationResult.error?.data as AxiosError).message,
      });
  }, [useSendOtpMutationResult]);

  return (
    <>
      <Link onPress={onOpen} underline="always">
        {t("forgotPassword.action")}
      </Link>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t("forgotPassword.label")}
              </ModalHeader>
              <ModalBody>
                <Input
                  startContent={<CiMail />}
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  type="email"
                  errorMessage={errorEmailMessage}
                  label="Email"
                  isInvalid={errorEmailMessage ? true : false}
                  placeholder="you@example.com"
                  labelPlacement="outside"
                  description="Enter your email so we can send you a otp"
                ></Input>
                {useSendOtpMutationResult.isSuccess && (
                  <>
                    <Input
                      startContent={<CiMail />}
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      errorMessage={errorEmailMessage}
                      label="OTP"
                      isInvalid={errorEmailMessage ? true : false}
                      labelPlacement="outside"
                      description="Enter your otp"
                    ></Input>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                      label={t("sign up.password.label")}
                      placeholder={t("sign up.password.placeholder")}
                    />
                    <Input
                      type="password"
                      value={rePassword}
                      onChange={(e) => setrePassword(e.target.value)}
                      label={t("sign up.re password.label")}
                      placeholder={t("sign up.re password.placeholder")}
                    />
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {useSendOtpMutationResult.isLoading ? (
                  <Spinner />
                ) : (
                  <Button color="primary" onPress={() => sendOtpHandler(email)}>
                    Send OTP
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResetPasswordButton;
