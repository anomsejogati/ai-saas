import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TopNav from "@/components/nav/top-nav";
import { ClerkProvider } from "@clerk/nextjs";
import { ImageProvider } from "@/context/image";
import { ThemeProvider } from "@/context/theme";
import PaypalProvider from "@/actions/paypal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Generator by Kawwan AI",
  description: "Optimize your work with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute={"class"}
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ImageProvider>
              <PaypalProvider>
                <TopNav />
                {children}
              </PaypalProvider>
            </ImageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
