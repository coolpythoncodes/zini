"use client";

import BackButton from "@/components/common/back-button";
import FormErrorTextMessage from "@/components/common/form-error-text-message";
import { Icons } from "@/components/common/icons";
import PageTitle from "@/components/common/page-title";
import PageWrapper from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";
import { CardStack } from "@/components/ui/card-stack";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { routes } from "@/lib/routes";
import { amounts } from "@/lib/utils";
import { useUiStore } from "@/store/useUiStore";
import { yupResolver } from "@hookform/resolvers/yup";
import numeral from "numeral";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { type InferType, number, object } from "yup";
import GroupInfoCard from "./group-info-card";
import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { client } from "@/app/client";
import { liskSepolia } from "@/lib/libs";
import { contractAddress } from "@/contract";
import { group } from "console";

type Props = {
  id: string;
};

const loanSchema = object({
  amount: number()
    .positive("Invalid input")
    .integer("Invalid input")
    .typeError("Invalid input")
    .required("Amount is required"),
});

type FormData = InferType<typeof loanSchema>;
interface GroupProps {
  id: bigint;
}

const GroupPageClientSide = ({ id }: any) => {
  const { setPage } = useUiStore();
  const contract = getContract({
    client: client,
    chain: liskSepolia,
    address: contractAddress,
  });

  const {
    data: groupData,
    isLoading: idLoading,
    refetch: refetchGroupData,
  } = useReadContract({
    contract,
    method:
      "function groups(int256) returns (uint256,uint256,uint256,uint256,uint256,bool,bool,uint256,string,address,uint256)",
    params: [BigInt(id)],
  });

  console.log(groupData);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loanSchema),
  });

  const handleAmountInput = (value: number) => {
    setValue("amount", value);
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  useEffect(() => {
    setPage({ previousRouter: routes.dashboard });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    useUiStore.persist.rehydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="pt-4">
      {groupData && (
        <PageWrapper>
          <div className="flex items-center">
            <BackButton />
            <PageTitle text={groupData[8]} />
          </div>
          <div className="mt-14 space-y-4">
            <div className="h-[246px]">
              <CardStack items={CARDS} />
            </div>
            {/* Activities */}
            <div className="space-y-2">
              <h1 className="text-base font-semibold leading-[18px] text-[#0A0F29]">
                Activities
              </h1>
              <div className="space-y-3 rounded-lg border border-[#D7D9E4] bg-[#F8FDF5] py-3 pl-3 pr-[14px] shadow-[0px_4px_8px_0px_#0000000D]">
                <div className="grid grid-cols-2 divide-x-[1px] divide-[#0A0F2933]">
                  <div className="space-y-1 pr-[34px] text-center">
                    <p className="text-xs font-normal text-[#696F8C]">
                      Total loan borrowed by you
                    </p>
                    <p className="text-sm font-medium leading-4 text-[#696F8C]">
                      #20,000
                    </p>
                  </div>
                  <div className="space-y-1 pl-[31px] text-center">
                    <p className="text-xs font-normal text-[#696F8C]">
                      Total loan left to be repaid by you
                    </p>
                    <p className="text-sm font-medium leading-4 text-[#696F8C]">
                      #10,000
                    </p>
                  </div>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="bg-[#4A9F17]">Repay Loan</Button>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="rounded-tl-[50px] rounded-tr-[50px]"
                  >
                    <SheetHeader>
                      <SheetTitle>Repay loan</SheetTitle>
                      <SheetDescription className="pb-32">
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="space-y-5"
                        >
                          <div>
                            <Input
                              placeholder="Enter the amount you want to repay"
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
                          <Button className="bg-[#4A9F17]">Continue</Button>
                        </form>

                        {/* This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers. */}
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* more information about group */}
            <div className="space-y-2">
              <h1 className="text-base font-semibold leading-[18px] text-[#0A0F29]">
                More information about group
              </h1>
              <div className="grid grid-cols-3 gap-x-5">
                <GroupInfoCard
                  text="Total no of members"
                  value={String(groupData[10])}
                  icon="profile"
                />
                <GroupInfoCard
                  text="Total loan given out"
                  value="#400,000"
                  icon="requestLoan"
                />
                <GroupInfoCard
                  text="Total repaid"
                  value="#320,000"
                  icon="repayLoan"
                />
              </div>
            </div>
            {/* Recent transactions */}
            <div className="space-y-2">
              <h1 className="text-base font-semibold leading-[18px] text-[#0A0F29]">
                Recent Transactions
              </h1>
              {/* <EmptyState text="Transaction details go here" /> */}

              <div className="flex items-center justify-between rounded-[8px] border border-[#D7D9E4] bg-white px-4 py-5 shadow-[0px_4px_8px_0px_#0000000D]">
                <div className="flex items-center gap-x-3">
                  <Icons.bitcoinBag className="h-10 w-10" />
                  <div>
                    <p className="text-base font-normal leading-[18px] text-[#0A0F29]">
                      Group 3
                    </p>
                    <p className="text-xs font-normal leading-[14px] text-[#696F8C]">
                      Today at 12:45pm
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-base font-medium leading-[18px] text-[#0A0F29]">
                    #10,000
                  </p>
                  <p className="flex justify-end text-xs font-normal leading-[14px] text-[#098C28]">
                    Deposit
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-[8px] border border-[#D7D9E4] bg-white px-4 py-5 shadow-[0px_4px_8px_0px_#0000000D]">
                <div className="flex items-center gap-x-3">
                  <Icons.bitcoinBag className="h-10 w-10" />
                  <div>
                    <p className="text-base font-normal leading-[18px] text-[#0A0F29]">
                      Group 3
                    </p>
                    <p className="text-xs font-normal leading-[14px] text-[#696F8C]">
                      Today at 12:45pm
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-base font-medium leading-[18px] text-[#0A0F29]">
                    #10,000
                  </p>
                  <p className="flex justify-end text-xs font-normal leading-[14px] text-[#B90F0F]">
                    Loan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageWrapper>
      )}
    </main>
  );
};

export default GroupPageClientSide;

const CARDS = [
  {
    id: 0,
    text: "Total Group Savings",
    value: "#200,000",
    className: "bg-gradient-to-bl from-[#00A6C2] to-[#70E77E]",
  },
  {
    id: 1,
    className: "bg-gradient-to-bl from-[#1544DF] to-[#00A6C2]",
    text: "Total Group members",
    value: "10",
  },
  {
    id: 2,
    className: "bg-gradient-to-bl from-[#6C40D9] to-[#A858EE]",
    text: "Total loan given out",
    value: "#250,000",
  },
];
