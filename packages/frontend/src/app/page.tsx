import { Icons } from "@/components/common/icons";

export default function HomePage() {
  return (
    <main className="bg-[#34581C]">
      <div className="error grid h-full place-items-center">
        <div className="flex flex-col items-center">
          <Icons.logo />
          <p className="text-2xl leading-10 text-white">SavvyCircle</p>
        </div>
      </div>
    </main>
  );
}
