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
import { useReadContract } from "thirdweb/react";


import { routes } from "@/lib/routes";
import { getContract } from "thirdweb";
import { client } from "@/app/client";
import { defineChain } from "thirdweb/chains";
import { contractAddress } from "@/contract";
import { useAuthContext } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useFetchGroup } from "@/hooks/useFetchGroup";
import { useFetchGroups } from "@/hooks/useFetchGroups";

// import EmptyState from "@/components/common/empty-state";

const DashboardPage = () => {
  const liskSepolia = defineChain(4202);
  const { userGroupId } = useAuthContext()
  const [userGroup, setUserGroup] = useState<any>([]);

  const contract = getContract({
    client: client,
    chain: liskSepolia,
    address: contractAddress,
    abi: abi,
  })

  // const groupInfo = useCallback()
  console.log(userGroupId);

  const { data: groupsData, isLoading, error } = useReadContract({
    contract,
    method: "function getGroups(int256[]) view returns (tuple(uint256,uint256,uint256,uint256,uint256,string,address,uint256)[])",
    params: [userGroupId],
  });



  console.log(`Result is given as`, groupsData);



  return (
    <main className="min-h-screen">
      <DashboardHeader />
      <PageWrapper className="mt-[238px] space-y-5 pb-[34px]">
        <section className="space-y-2">
          <h1 className="py-4 text-base font-medium leading-[18px] text-[#0A0F29]">
            Saving groups
          </h1>
          <div
          // 456
          // className="grid grid-cols-2 gap-x-4"
          >
            {/* <EmptyState text="Group details go here" /> */}
            <ElementList
              itemsCount={6}
              rootClassName="grid grid-cols-2 gap-x-4 gap-y-2"
            >
              <Link href={routes.groupById("1")}>
                <div className="space-y-8 rounded-[8px] border border-[#D7D9E4] bg-white p-4 shadow-[0px_4px_8px_0px_#0000000D]">
                  <Icons.bitcoinBag className="h-10 w-10" />
                  <div className="space-y-1 font-normal">
                    <p className="text-xs leading-[14px] text-[#098C28]">
                      #40,000
                    </p>
                    <p className="text-base leading-[18px] text-[#0A0F29]">
                      Group 1
                    </p>
                  </div>
                </div>
              </Link>
            </ElementList>
          </div>
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
