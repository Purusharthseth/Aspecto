import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aspecto",
  description: "I made it.",
   icons: {
    icon: "/Aspecto.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#7b2dd8",
          colorDanger: "#ef4444",
          colorSuccess: "#22c55e",
          colorWarning: "#facc15",
          colorNeutral: "#3b3b3b",
          colorText: "#f3f4f6",
          colorTextOnPrimaryBackground: "#ffffff",
          colorTextSecondary: "#d1d5db",
          colorBackground: "#18181b",
          colorInputText: "#f3f4f6",
          colorInputBackground: "#27272a",
          colorShimmer: "#7b2dd8",
          fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui",
          fontFamilyButtons: "var(--font-geist-sans), ui-sans-serif, system-ui",
          fontSize: "1rem",
          borderRadius: "1rem",
          spacingUnit: "1.25rem",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
