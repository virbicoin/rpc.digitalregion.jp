"use client";

import Image from "next/image";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function Header() {
  return (
    <header className="w-full py-8 header-border">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Image
              src="/VBC.svg"
              alt="VirBiCoin Logo"
              width={48}
              height={48}
              className="drop-shadow-lg"
              priority
            />
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              VirBiCoin Node
            </h1>
          </div>
          <div className="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
        <p className="text-center subtitle-text mt-2 text-sm">
          Real-time blockchain node monitoring dashboard
        </p>
      </div>
    </header>
  );
}
