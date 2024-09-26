import IconElement from "@/components/common/icon-element";
import { Icons } from "@/components/common/icons";
import PageWrapper from "@/components/common/page-wrapper";
import { Menu } from "lucide-react";
import Link from "next/link";
import { dashboardNavigation } from "./extras";

const DashboardHeader = () => {
  return (
    <div className="fixed grid h-[192px] w-full place-items-center rounded-bl-[30px] rounded-br-[30px] bg-[#4A9F17]">
      <header className="relative w-full text-white">
        <PageWrapper>
          <div className="flex items-center justify-between pb-[14px]">
            <div className="flex items-center gap-x-2">
              <Icons.logo className="h-[29px] w-[33px]" />
              <p className="text-base font-medium">SavvyCircle</p>
            </div>
            <button>
              <Menu />
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-normal leading-[14px]">
              Current saving balance
            </p>
            <p className="text-lg font-semibold leading-6">#200,000</p>
          </div>
        </PageWrapper>
        <PageWrapper className="absolute left-0 right-0 mt-5 grid h-[76px] w-[85%] grid-cols-3 items-center justify-center rounded-[8px] border border-[#D7D9E4] bg-[#F8FDF5] shadow-[0px_4px_8px_0px_#0000000D]">
          {dashboardNavigation.map((navigation, index) => (
            <Link key={`dashboard-navigation-${index}`} href={navigation.route}>
              <div className="flex flex-col items-center space-y-[2px]">
                <IconElement iconName={navigation.icon} />
                <p className="text-xs font-normal leading-[14px] text-[#696F8C]">
                  {navigation.text}
                </p>
              </div>
            </Link>
          ))}
        </PageWrapper>
      </header>
    </div>
  );
};

export default DashboardHeader;
