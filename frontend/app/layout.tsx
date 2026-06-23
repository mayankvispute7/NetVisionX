import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NetVisionX | Command Center",
  description: "AI Powered Network Monitoring and Automation Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Make sure className="dark" is REMOVED here
    <html lang="en">
      <body className={`${inter.className} selection:bg-blue-500/20`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          
          <main className="flex-1 flex flex-col min-w-0">
            <Topbar />
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}