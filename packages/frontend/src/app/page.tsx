import { Icons } from "@/components/common/icons";
import Link from "next/link";

import { initMiniApp } from "@telegram-apps/sdk";

export default function HomePage() {
  const [miniApp] = initMiniApp();

  miniApp.ready();
  return (
    <main className="bg-[#34581C]">
      <Link href="/login">
        <div className="error grid h-full place-items-center">
          <div className="flex flex-col items-center">
            <Icons.logo />
            <p className="text-2xl leading-10 text-white">SavvyCircle</p>
          </div>
        </div>
      </Link>
    </main>
  );
}
