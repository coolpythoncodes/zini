import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const PageWrapper = ({ children, className }: Props) => {
  return <div className={cn("layout-container", className)}>{children}</div>;
};

export default PageWrapper;
