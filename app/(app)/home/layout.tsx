"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex flex-col items-center justify-center w-full">
        <div role="tablist" className="tabs tabs-border tabs-lg">
          <Link href={"/home/images"} role="tab" className={`tab ${pathname === "/home/images" ? "tab-active text-accent" : ""}`}>
            Images
          </Link>
          <Link href={"/home/videos"} role="tab" className={`tab ${pathname === "/home/videos" ? "tab-active text-accent" : ""}`}>
            Videos
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
