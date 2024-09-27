// useFetchGroups.ts
import { client } from '@/app/client'
import { contractAddress } from '@/contract'
import { ContractOptions, getContract } from 'thirdweb'
import { defineChain } from "thirdweb/chains";
import { useReadContract } from 'thirdweb/react';
import { useState, useEffect } from 'react';
import { tokenAddress } from '@/token';

export const liskSepolia = defineChain(4202)

export const contractInstance = getContract({
    client: client,
    chain: liskSepolia,
    address: contractAddress,
})


const tokenContract = getContract({
    client: client,
    chain: liskSepolia,
    address: tokenAddress,
}) as Readonly<ContractOptions<[]>>