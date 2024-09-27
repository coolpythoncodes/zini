import { client } from '@/app/client'
import { contractAddress } from '@/contract'
import { getContract } from 'thirdweb'
import { defineChain } from "thirdweb/chains";
import { useReadContract } from 'thirdweb/react';

const liskSepolia = defineChain(4202)

const contract = getContract({
    client: client,
    chain: liskSepolia,
    address: contractAddress,
})

export const useFetchGroup = (id: bigint | null) => {
    const result = useReadContract({
        contract,
        method: "function groups(int256) returns (uint256, uint256, uint256, uint256, uint256, bool, bool, uint256, string, address, uint256)",
        params: [id ?? BigInt(0)]
    })

    return {
        data: id !== null ? result.data : undefined,
        error: result.error,
        isLoading: result.isLoading,
    }
}