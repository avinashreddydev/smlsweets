import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Sri Mahalakshmi Sweets",
    template: "%s | Sri Mahalakshmi Sweets",
  },
  description: "Authentic, handcrafted Indian sweets.",
  openGraph: {
    title: "Sri Mahalakshmi Sweets",
    description: "Authentic, handcrafted Indian sweets made with love.",
    siteName: "Sri Mahalakshmi Sweets",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sri Mahalakshmi Sweets",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Mahalakshmi Sweets",
    description: "Authentic, handcrafted Indian sweets.",
    images: ["/og-image.png"],
  },
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
        </Providers>
      </body>
    </html>
  );
}
