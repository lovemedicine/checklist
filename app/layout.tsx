import type { Metadata } from "next";
import Auth from "@/components/Auth";
import Providers from "@/components/Providers";
import "./global.css";

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
      <body style={{ margin: 0 }}>
        <Providers>
          <Auth />
          <div className="font-mono p-2">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
