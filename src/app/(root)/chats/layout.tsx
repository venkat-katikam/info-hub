import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Infohub",
  description: "Infohub social media application built using nextjs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Topbar />
        <main className="flex flex-row">
          <LeftSidebar />
          <section className="flex min-h-screen flex-1 flex-col items-center bg-dark-1 px-3 pb-10 pt-20 max-md:pb-32 sm:px-3">
            <div className="w-full max-w-4xl">{children}</div>
          </section>
          <RightSidebar />
        </main>
        <Bottombar />
      </body>
    </html>
  );
}
