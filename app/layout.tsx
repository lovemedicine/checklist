import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Auth from "@/components/Auth";
import Providers from "@/components/Providers";
import "./global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "checklists",
  description: "An app for reusing checklists",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0 }}>
        <Providers>
          <Auth />
          <div style={{ padding: 10 }}>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
