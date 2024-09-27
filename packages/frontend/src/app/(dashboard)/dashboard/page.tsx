"use client";

import { Icons } from "@/components/common/icons";
import PageWrapper from "@/components/common/page-wrapper";
import ElementList from "@/components/misc/element-list";
import Link from "next/link";
import DashboardHeader from "./components/dashbord-header";
import { getContract } from "thirdweb";
import { client } from "@/app/client";
import { defineChain } from "thirdweb/chains";
import { abi, contractAddress } from "@/contract";
import { useAuthContext } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useFetchGroup } from "@/hooks/useFetchGroup";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import Group from "./components/group";

import { routes } from "@/lib/routes";
// import EmptyState from "@/components/common/empty-state";

const DashboardPage = () => {
  const liskSepolia = defineChain(4202);
  // const { userGroupId } = useAuthContext()
  const account = useActiveAccount();
  const [userGroup, setUserGroup] = useState<any>([]);

  const contract = getContract({
    client: client,
    chain: liskSepolia,
    address: contractAddress,
    abi: abi,
  });

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

  return (
    <main className="min-h-screen">
      <DashboardHeader />
      <PageWrapper className="mt-[238px] space-y-5 pb-[34px]">
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

        <section className="space-y-2">
          <h1 className="text-base font-medium leading-[18px] text-[#0A0F29]">
            Recent Transactions
          </h1>
          {/* <EmptyState text="Transaction details go here" /> */}
          <ElementList itemsCount={2} rootClassName="grid gap-y-1">
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
          </ElementList>
        </section>
      </PageWrapper>
    </main>
  );
};

export default DashboardPage;
