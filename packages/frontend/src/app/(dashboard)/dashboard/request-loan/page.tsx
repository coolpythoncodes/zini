"use client";

import BackButton from "@/components/common/back-button";
import FormErrorTextMessage from "@/components/common/form-error-text-message";
import { Icons } from "@/components/common/icons";
import PageTitle from "@/components/common/page-title";
import PageWrapper from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useDisclosure from "@/hooks/use-disclosure.hook";
import { routes } from "@/lib/routes";
import { amounts, cn, groups } from "@/lib/utils";
import { useUiStore } from "@/store/useUiStore";
import { yupResolver } from "@hookform/resolvers/yup";
import numeral from "numeral";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { type InferType, number, object, string } from "yup";
import RequestLoanModal from "./request-loan-modal";

const requestLoanSchema = object({
  group: string().required("group is required"),
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
    control,
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
      <RequestLoanModal {...{ isOpen, onClose }} />
      <main className="space-y-4 pt-4">
        <PageWrapper>
          <div className="flex items-center">
            <BackButton />
            <PageTitle text="Request Loan" />
          </div>

          <>
            <h1 className="py-4 text-base font-medium leading-[18px] text-[#0A0F29]">
              Select a group to request loan
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Controller
                  name="group"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      onValueChange={onChange}
                      defaultValue={value}
                      className="grid grid-cols-2 gap-x-4 gap-y-2"
                    >
                      {groups.map((group, index) => (
                        <div key={`groups-${index}`}>
                          <RadioGroupItem
                            value={group.value}
                            id={group.value}
                            className="hidden"
                          />
                          <Label htmlFor={group.value}>
                            <div
                              className={cn(
                                "space-y-8 rounded-[8px] border border-[#D7D9E4] bg-white p-4 shadow-[0px_4px_8px_0px_#0000000D]",
                                {
                                  "bg-[#BDEBA1]": value === group.value,
                                },
                              )}
                            >
                              <Icons.bitcoinBag className="h-10 w-10" />
                              <div className="space-y-1 font-normal">
                                <p className="text-xs leading-[14px] text-[#098C28]">
                                  {group.amount}
                                </p>
                                <p className="text-base leading-[18px] text-[#0A0F29]">
                                  {group.name}
                                </p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                <FormErrorTextMessage errors={errors.group} />
              </div>

              {/* </div> */}
              <div className="space-y-3 rounded-lg border border-[#D7D9E4] bg-[#F8FDF5] px-4 py-7 shadow-[0px_4px_8px_0px_#0000000D]">
                <div className="space-y-4">
                  <h2 className="text-center text-base font-medium text-[#0A0F29]">
                    Reqest loan
                  </h2>
                  <div>
                    <Input
                      placeholder="Enter amount"
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
          </>
        </PageWrapper>
      </main>
    </>
  );
};

export default RequestLoanPage;
