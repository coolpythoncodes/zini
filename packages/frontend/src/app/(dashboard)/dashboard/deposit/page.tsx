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
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { type InferType, number, object, string } from "yup";
import DepositModal from "./deposit-modal";
import {
  useActiveAccount,
  useReadContract,
  useSendBatchTransaction,
  useSendTransaction,
} from "thirdweb/react";
import { ContractOptions, getContract, prepareContractCall } from "thirdweb";
import { client } from "@/app/client";
import { abi, contractAddress } from "@/contract";
import { defineChain } from "thirdweb/chains";
import { bigint } from "zod";
import { contractInstance } from "@/lib/libs";
import Group from "../components/group";
import { tokenAddress } from "@/token";

const depositSchema = object({
  group: string().required("group is required"),
  amount: number()
    .positive("Invalid input")
    .integer("Invalid input")
    .typeError("Invalid input")
    .required("Amount is required"),
});

type FormData = InferType<typeof depositSchema>;

const DepositPage = () => {
  const { setPage } = useUiStore();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [amount, setAmount] = useState<string>("");

  const {
    mutate: sendBatch,
    data: transactionResult,
    isPending: pending,
    isError: error,
    isSuccess: success,
  } = useSendBatchTransaction();

  const {
    mutate: sendTransaction,
    data: result,
    isPending: pendings,
    isError: errors,
    isSuccess: successs,
  } = useSendTransaction();

  const account = useActiveAccount();

  const liskSepolia = defineChain(4202);

  const contract = getContract({
    client: client,
    chain: liskSepolia,
    address: contractAddress,
    abi: abi,
  });

  const tokenContract = getContract({
    client: client,
    chain: liskSepolia,
    address: tokenAddress,
  }) as Readonly<ContractOptions<[]>>;

  const onClick = async (amount: bigint) => {
    try {
      console.log("Transferring to client");

      const tx1 = prepareContractCall({
        contract: tokenContract,
        method: "function approve(address, uint256) returns(bool)",
        params: [contractAddress, amount],
      });

      // const tx2 = prepareContractCall({
      //   contract: contractInstance,
      //   method: "function deposit(int256)",
      //   params: [1n]
      // })

      // sendBatch([tx1, tx2]);
      sendTransaction(tx1);
      console.log(transactionResult);

      // sendTransaction(tx2);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: _userGroupId,
    isLoading: idLoadings,
    refetch: refectUserGroupId,
  } = useReadContract({
    contract,
    method: "function getUserGroups(address) returns (int256[])",
    params: [account?.address || "0x00000000"],
  });

  // const groupInfo = useCallback()
  console.log(_userGroupId);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: {},
  } = useForm<FormData>({
    resolver: yupResolver(depositSchema),
  });

  const onSubmit = () => {
    // console.log(data);
    // onOpen();
    onClick(BigInt(amount));
  };

  const handleAmountInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log(value);

    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  useEffect(() => {
    setPage({ previousRouter: routes.dashboard });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    useUiStore.persist.rehydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DepositModal {...{ isOpen, onClose }} />
      <main className="pt-4">
        <PageWrapper>
          <div className="flex items-center">
            <BackButton />
            <PageTitle text="Deposit" />
          </div>
          <>
            <h1 className="py-4 text-base font-medium leading-[18px] text-[#0A0F29]">
              Select a group to make a deposit
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* <div>
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
                            onClick={() => setAmount(Number(group.amount))}
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
                                  #{group.amount}
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
              </div> */}

              <section className="space-y-2">
                <h1 className="py-4 text-base font-medium leading-[18px] text-[#0A0F29]">
                  Saving groups
                </h1>
                {_userGroupId ? (
                  <div
                  // 456
                  // className="grid grid-cols-2 gap-x-4"
                  >
                    {/* <EmptyState text="Group details go here" /> */}
                    {_userGroupId && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {_userGroupId?.map((id) => (
                          <Group key={id.toString()} id={id} />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p>Join a group in the telegram</p>
                  </div>
                )}
              </section>

              {/* </div> */}
              <div className="space-y-3 rounded-lg border border-[#D7D9E4] bg-[#F8FDF5] px-4 py-7 shadow-[0px_4px_8px_0px_#0000000D]">
                <div className="space-y-4">
                  <h2 className="text-center text-base font-medium text-[#0A0F29]">
                    Make a deposit
                  </h2>
                  <div>
                    <Input
                      placeholder="Enter deposit amount"
                      className="tect-base font-medium text-[#696F8C] placeholder:text-[#696F8C]"
                      value={amount}
                      onChange={handleAmountInput}
                    />
                    {/* <FormErrorTextMessage errors={errors.amount} /> */}
                  </div>

                  <div className="flex items-center justify-center gap-x-5">
                    {amounts.map((amount, index) => (
                      <Button
                        key={`amount-${index}`}
                        type="button"
                        className="h-8 w-[67px] text-xs font-normal leading-[14px] text-[#696F8C]"
                      >
                        #{numeral(amount).format("0,0")}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button className="bg-[#4A9F17]" onClick={onSubmit}>
                  {pendings
                    ? "Pending..."
                    : successs
                      ? "Sucessful"
                      : errors
                        ? "An error occured"
                        : "Continue"}
                </Button>
              </div>
            </form>
          </>
          {/* <div className="shadow-[0px_4px_8px_0px_#0000000D] bg-[#F8FDF5] px-4 py-7 space-y-3">
                    <h2 className="text-center text-[#0A0F29] text-base font-medium">Make a deposit</h2>
                </div> */}
        </PageWrapper>
      </main>
    </>
  );
};

export default DepositPage;
