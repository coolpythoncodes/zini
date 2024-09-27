import React, { useEffect, useState } from "react";
import Link from "next/link";
import { routes } from "../.../../../../../lib/routes";
import { Icons } from "../../../../components/common/icons";
import { useReadContract, useActiveAccount } from "thirdweb/react";
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "../../../../app/client";
import { contractAddress } from "../../../../contract";
import { formatEther } from "viem";
import { group } from "console";

const liskSepolia = defineChain(4202);

interface GroupProps {
  id: bigint;
}

const Group: React.FC<GroupProps> = ({ id }) => {
  const account = useActiveAccount();
  const [groupInfo, setGroupInfo] = useState<any>([]);

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
    params: [id],
  });

  // console.log(groupData);

  useEffect(() => {
    setGroupInfo(groupData);
  }, [groupData]);

  function formatViemBalance(balance: bigint): string {
    // Convert the balance to a number
    const balanceInEther = parseFloat(formatEther(balance));

    // Format the number with commas
    const formattedBalance = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
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

  // console.log(groupInfo[0);

  // console.log(groupInfo[7]);

  // You can use groupData here to display the group information
  // For now, we'll just use placeholder data

  return (
    <div>
      <Link href={routes.groupById(id.toString())}>
        {groupInfo && (
          <div className="space-y-8 rounded-[8px] border border-[#D7D9E4] bg-white p-4 shadow-[0px_4px_8px_0px_#0000000D]">
            <Icons.bitcoinBag className="h-10 w-10" />
            <div className="space-y-1 font-normal">
              <p className="text-xs leading-[14px] text-[#098C28]">
                # {groupInfo[0] ? formatViemBalance(groupInfo[0]) : 0}
              </p>
              <p className="text-base leading-[18px] text-[#0A0F29]">
                {groupInfo[8]}
              </p>
            </div>
          </div>
        )}
      </Link>
    </div>
  );
};

export default Group;
