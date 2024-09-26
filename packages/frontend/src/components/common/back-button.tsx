"use client";
import { useUiStore } from "@/store/useUiStore";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const BackButton = () => {
  const router = useRouter();

  const { page } = useUiStore();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    useUiStore.persist.rehydrate();
  }, []);

  const handleNavigation = () => {
    if (page?.previousRouter) {
      router.push(page.previousRouter);
    }
    router.back();
  };

  return <ChevronLeft className="text-[#696F8C]" onClick={handleNavigation} />;
};

export default BackButton;
