import AuthContextProvider from "@/context/AuthContext";
import { montserrat } from "@/lib/font";
import "@/styles/globals.css";

import { type Metadata } from "next";
import { ThirdwebProvider } from "thirdweb/react";

export const metadata: Metadata = {
  title: "Savvy Circle",
  description:
    "SavvyCircle is a dApp for group savings and loans with Telegram integration, offering secure, automated transactions via blockchain.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${montserrat.className}`}
    >
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body className="flex min-h-dvh flex-col">
        <div className="grid flex-1">
          <ThirdwebProvider>
            <AuthContextProvider>{children}</AuthContextProvider>
          </ThirdwebProvider>
        </div>
      </body>
    </html>
  );
}
