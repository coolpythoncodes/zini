import IconElement from "@/components/common/icon-element";
import { Icons } from "@/components/common/icons";
import PageWrapper from "@/components/common/page-wrapper";
import { Menu } from "lucide-react";
import Link from "next/link";
import { dashboardNavigation } from "./extras";
import { getContract } from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "@/app/client";
import { abi, contractAddress } from "@/contract";
import { defineChain } from "thirdweb/chains";
import { tokenAbi, tokenAddress } from "@/token";
import { formatEther } from "viem";
import { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";

const liskSepolia = defineChain(4202);

const DashboardHeader = () => {
  const { userGroupId, setUserGroupId } = useAuthContext()

  const contract = getContract({
    client: client,
    chain: liskSepolia,
    address: contractAddress,
    // abi: abi,
  })

  const tokenContract = getContract({
    client: client,
    chain: liskSepolia,
    address: tokenAddress,
    // abi: abi,
  })



  // 0x5C2103Cc49a53265511A9E6dC9fE4840211A6aF8
  // -4596867717

  // -1002475953402
  const account = useActiveAccount();

  const { data: _userGroupId, isLoading: idLoading, refetch: refectUserGroupId } = useReadContract({
    contract,
    method: "function getUserGroups(address) returns (int256[])",
    params: [account?.address || "0x00000000"],

  })
  useEffect(() => {
    if (account?.address) {
      refectUserGroupId();

    }

  }, [account?.address])

  useEffect(() => {
    if (_userGroupId) {
      const mutableUserGroupId = [..._userGroupId];
      setUserGroupId(mutableUserGroupId)
    }

  }, [_userGroupId])
  console.log(_userGroupId);




  function formatViemBalance(balance: bigint): string {
    // Convert the balance to a number
    const balanceInEther = parseFloat(formatEther(balance));

    // Format the number with commas
    const formattedBalance = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(balanceInEther);

    // Add magnitude representation for millions and thousands
    if (balanceInEther >= 1000000) {
      return `${formattedBalance}`;
    } else if (balanceInEther >= 1000) {
      return `${formattedBalance}`;
    } else {
      return formattedBalance;
    }
  }

  const { data: userBalance, isLoading: tokenBalanceLoading } = account
    ? useReadContract({
      contract: tokenContract,
      method: "function balanceOf(address) returns (uint256)",
      params: [account.address],
    })
    : { data: undefined, isLoading: false };

  const { data, isLoading } = useReadContract({
    contract,
    method: "function LOAN_DURATION() returns (uint256)",
    params: [],
  })

  console.log("Data is given as", data);
  console.log("Wallet is given as", account?.address);
  console.log("User Token balance is ", userBalance);
  return (
    <div className="fixed grid h-[192px] w-full place-items-center rounded-bl-[30px] rounded-br-[30px] bg-[#4A9F17]">
      <header className="relative w-full text-white">
        <PageWrapper>
          <div className="flex items-center justify-between pb-[14px]">
            <div className="flex items-center gap-x-2">
              <Icons.logo className="h-[29px] w-[33px]" />
              <p className="text-base font-medium">SavvyCircle</p>
            </div>
            <button>
              <Menu />
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-normal leading-[14px]">
              Current saving balance
            </p>
            <p className="text-lg font-semibold leading-6"># {formatViemBalance(userBalance || BigInt(200000000000)) || `200,000`}</p>
          </div>
        </PageWrapper>
        <PageWrapper className="absolute left-0 right-0 mt-5 grid h-[76px] w-[85%] grid-cols-3 items-center justify-center rounded-[8px] border border-[#D7D9E4] bg-[#F8FDF5] shadow-[0px_4px_8px_0px_#0000000D]">
          {dashboardNavigation.map((navigation, index) => (
            <Link key={`dashboard-navigation-${index}`} href={navigation.route}>
              <div className="flex flex-col items-center space-y-[2px]">
                <IconElement iconName={navigation.icon} />
                <p className="text-xs font-normal leading-[14px] text-[#696F8C]">
                  {navigation.text}
                </p>
              </div>
            </Link>
          ))}
        </PageWrapper>
      </header>
    </div>
  );
};

export default DashboardHeader;
