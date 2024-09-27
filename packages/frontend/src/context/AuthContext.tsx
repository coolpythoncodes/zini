'use client'
import React, { useContext, useState } from "react";
import { client } from "@/app/client";
import { contractAddress } from "@/contract";
import { createContext, useEffect } from "react"
import { getContract } from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { undefined } from "zod";
const liskSepolia = defineChain(4202);


interface IAuthContext {
    userGroupId: bigint[];
    setUserGroupId: (value: bigint[]) => void;
}
export const AuthContext = createContext({} as IAuthContext);


export default function AuthContextProvider({ children }: { children: React.ReactNode; }) {
    const account = useActiveAccount();
    const [userGroupId, setUserGroupId] = useState<bigint[]>([])


    return (
        <AuthContext.Provider value={{
            userGroupId,
            setUserGroupId
        }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuthContext = () => useContext(AuthContext);