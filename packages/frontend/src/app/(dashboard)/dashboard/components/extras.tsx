import { type Icons } from "@/components/common/icons";
import { routes } from "@/lib/routes";

export const dashboardNavigation: {
  icon: keyof typeof Icons;
  text: string;
  route: string;
}[] = [
  {
    icon: "pay",
    text: "Deposit",
    route: routes.deposit,
  },
  {
    icon: "requestLoan",
    text: "Request Loan",
    route: routes.requestLoan,
  },
  {
    icon: "repayLoan",
    text: "Repay Loan",
    route: routes.repayLoan,
  },
];
