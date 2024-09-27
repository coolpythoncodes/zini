// useFetchGroups.ts
import { client } from '@/app/client'
import { contractAddress } from '@/contract'
import { getContract } from 'thirdweb'
import { defineChain } from "thirdweb/chains";
import { useReadContract } from 'thirdweb/react';
import { useState, useEffect } from 'react';

const liskSepolia = defineChain(4202)

const contract = getContract({
    client: client,
    chain: liskSepolia,
    address: contractAddress,
})

export const useFetchGroups = (ids: (bigint | null)[]) => {
    const [groupsData, setGroupsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Create an array of useReadContract calls, one for each id
    const groupResults = ids.map(id =>
        useReadContract({
            contract,
            method: "function groups(int256) returns (uint256, uint256, uint256, uint256, uint256, bool, bool, uint256, string, address, uint256)",
            params: [id ?? BigInt(0)]
        })
    );

    useEffect(() => {
        const allLoaded = groupResults.every(result => !result.isLoading);
        const anyError = groupResults.find(result => result.error);

        if (allLoaded) {
            if (anyError) {
                setError(anyError.error instanceof Error ? anyError.error : new Error('An unknown error occurred'));
            } else {
                const validData = groupResults
                    .filter(result => result.data !== undefined)
                    .map(result => result.data);
                setGroupsData(validData);
            }
            setIsLoading(false);
        }
    }, [groupResults]);

    return { data: groupsData, isLoading, error };
};