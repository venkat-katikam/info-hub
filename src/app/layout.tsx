import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import UserStore from "@/context/UserContext";
import PostStore from "@/context/PostContext";

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
      <body className={`${inter.className} bg-dark-1`}>
        <UserStore>
          <PostStore>
            <>{children}</>
          </PostStore>
        </UserStore>
      </body>
    </html>
  );
}
