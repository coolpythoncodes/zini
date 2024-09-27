"use client";

import BackButton from "@/components/common/back-button";
import FormErrorTextMessage from "@/components/common/form-error-text-message";
import PageTitle from "@/components/common/page-title";
import PageWrapper from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDisclosure from "@/hooks/use-disclosure.hook";
import { routes } from "@/lib/routes";
import { amounts } from "@/lib/utils";
import { useUiStore } from "@/store/useUiStore";
import { yupResolver } from "@hookform/resolvers/yup";
import numeral from "numeral";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { type InferType, number, object } from "yup";
import RepayLoanModal from "./repay-loan-modal";

const repayLoanSchema = object({
  amount: number()
    .positive("Invalid input")
    .integer("Invalid input")
    .typeError("Invalid input")
    .required("Amount is required"),
});

type FormData = InferType<typeof repayLoanSchema>;

const RepayLoan = () => {
  const { setPage } = useUiStore();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(repayLoanSchema),
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
      <RepayLoanModal {...{ isOpen, onClose }} />
      <main className="space-y-4 pt-4">
        <PageWrapper>
          <div className="flex items-center">
            <BackButton />
            <PageTitle text="Loan" />
          </div>
        </PageWrapper>

        <PageWrapper>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3 rounded-lg border border-[#D7D9E4] bg-[#F8FDF5] px-4 py-7 shadow-[0px_4px_8px_0px_#0000000D]">
              <div className="space-y-4">
                <h2 className="text-center text-base font-medium text-[#0A0F29]">
                  Repay loan
                </h2>
                <div>
                  <Input
                    placeholder="Enter deposit amount"
                    className="tect-base font-medium text-[#696F8C] placeholder:text-[#696F8C]"
                    {...register("amount")}
                  />
                  <FormErrorTextMessage errors={errors.amount} />
                </div>

                <div className="flex items-center justify-center gap-x-5">
                  {amounts.map((amount, index) => (
                    <Button
                      key={`amount-${index}`}
                      type="button"
                      className="h-8 w-[67px] text-xs font-normal leading-[14px] text-[#696F8C]"
                      onClick={() => handleAmountInput(amount)}
                    >
                      #{numeral(amount).format("0,0")}
                    </Button>
                  ))}
                </div>
              </div>
              <Button className="bg-[#4A9F17]">Continue</Button>
            </div>
          </form>
        </PageWrapper>
      </main>
    </>
  );
};

export default RepayLoan;
