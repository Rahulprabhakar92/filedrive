import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/ConvexClientProvider";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "./Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  
  title: "FileDrive",
  description: "Upload your files",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ConvexClientProvider>
      <Toaster />
        <Header/>
        {children}
        <Footer/>
       
      
      </ConvexClientProvider>
        </body>
    </html>
  );
}
