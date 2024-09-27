import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const amounts = [10000, 20000, 30000];

export const groups = [
  {
    name: "Group 1",
    value: "group-1",
    amount: "40000",
  },
  {
    name: "Group 2",
    value: "group-2",
    amount: "10000",
  },
  {
    name: "Group 3",
    value: "group-3",
    amount: "60000",
  },
  {
    name: "Group 4",
    value: "group-4",
    amount: "100000",
  },
];
