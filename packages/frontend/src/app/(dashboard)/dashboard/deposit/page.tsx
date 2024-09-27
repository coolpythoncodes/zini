"use client";

import BackButton from "@/components/common/back-button";
import PageTitle from "@/components/common/page-title";
import PageWrapper from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/lib/routes";
import { useUiStore } from "@/store/useUiStore";
import { useEffect } from "react";

const DepositPage = () => {
  const { setPage } = useUiStore();

  useEffect(() => {
    setPage({ previousRouter: routes.dashboard });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    useUiStore.persist.rehydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
          <form>
            <div className="space-y-3 bg-[#F8FDF5] px-4 py-7 shadow-[0px_4px_8px_0px_#0000000D]">
              <div className="space-y-4">
                <h2 className="text-center text-base font-medium text-[#0A0F29]">
                  Make a deposit
                </h2>
                <Input placeholder="Enter deposit amount" />
              </div>
              <Button className="bg-[#4A9F17]">Continue</Button>
            </div>
          </form>
        </>
        {/* <div className="shadow-[0px_4px_8px_0px_#0000000D] bg-[#F8FDF5] px-4 py-7 space-y-3">
                    <h2 className="text-center text-[#0A0F29] text-base font-medium">Make a deposit</h2>
                </div> */}
      </PageWrapper>
    </main>
  );
};

export default DepositPage;
