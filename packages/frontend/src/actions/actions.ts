'use server'

import prisma from "@/lib/db"
import { userSchema } from "@/types/utils"

export async function createUser(params: userSchema) {
    await prisma.user.create({
        data: {
            username: params.username,
            address: params.address,
        }
    })
}