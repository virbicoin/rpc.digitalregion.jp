"use client";

import ThemeToggle from "@/app/components/ThemeToggle";

export default function Header() {
  return (
    <header className="w-full py-8 header-border">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center glow-blue">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
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
