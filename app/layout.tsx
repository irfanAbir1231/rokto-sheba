import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "রক্তসেবা",
  description: "Find and connect with blood donors around you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body>
          <Navbar />
          <ToastProvider />
          <main className="min-h-[calc(100vh-80px)]">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
