"use client";

import BackButton from "@/components/common/back-button";
import PageTitle from "@/components/common/page-title";
import PageWrapper from "@/components/common/page-wrapper";
import useDisclosure from "@/hooks/use-disclosure.hook";
import { routes } from "@/lib/routes";
import { useUiStore } from "@/store/useUiStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { type InferType, number, object } from "yup";

const requestLoanSchema = object({
  amount: number()
    .positive("Invalid input")
    .integer("Invalid input")
    .typeError("Invalid input")
    .required("Amount is required"),
});

type FormData = InferType<typeof requestLoanSchema>;

const RequestLoanPage = () => {
  const { setPage } = useUiStore();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(requestLoanSchema),
  });
  const onSubmit = (data: FormData) => {
    console.log(data);
    onOpen();
  };

  const handleAmountInput = (value: number) => {
    setValue("amount", value);
  };

  useEffect(() => {
    setPage({ previousRouter: routes.dashboard });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    useUiStore.persist.rehydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <main className="space-y-4 pt-4">
        <PageWrapper>
          <div className="flex items-center">
            <BackButton />
            <PageTitle text="Request Loan" />
          </div>
        </PageWrapper>
      </main>
    </>
  );
};

export default RequestLoanPage;
