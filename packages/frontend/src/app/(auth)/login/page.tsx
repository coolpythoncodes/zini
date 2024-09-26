import { Icons } from "@/components/common/icons";
import PageWrapper from "@/components/common/page-wrapper";
import LoginForm from "./components/login-form";

const LoginPage = () => {
  return (
    <main className="grid place-items-center bg-[#1C350C] text-white">
      <PageWrapper className="flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center gap-x-2">
            <Icons.logo className="h-[25px] w-[29px]" />
            <p className="text-base font-medium">SavvyCircle</p>
          </div>
          <p className="text-center text-xs font-normal leading-[14px]">
            SavvyCircle is a dApp for group savings and loans with Telegram
            integration, offering secure, automated transactions via blockchain.
          </p>
        </div>
        <LoginForm />
      </PageWrapper>
    </main>
  );
};

export default LoginPage;
