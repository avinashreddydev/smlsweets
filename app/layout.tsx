import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: {
    default: "Sri Mahalakshmi Sweets",
    template: "%s | Sri Mahalakshmi Sweets",
  },
  description: "Authentic, handcrafted Indian sweets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-white`}
      >
        <Providers>
          <Header />
          <CartDrawer />
          <main className="pt-20 pb-10 min-h-screen">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
