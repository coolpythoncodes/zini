"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UiStoreProps {
  page: { previousText?: string | null; previousRouter?: string | null } | null;
  setPage: (value: UiStoreProps["page"]) => void;
}

export const useUiStore = create<UiStoreProps>()(
  persist(
    (set) => ({
      page: null,
      setPage: (value: UiStoreProps["page"]) => set({ page: value }),
    }),
    {
      name: "ui-storage",
      skipHydration: true,
    },
  ),
);
