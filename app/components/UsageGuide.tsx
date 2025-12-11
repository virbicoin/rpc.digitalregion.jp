"use client";

export default function UsageGuide() {
  return (
    <div className="glass-card p-6 animate-fade-in h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-primary">Usage Guide</h2>
      </div>
      <ul className="space-y-3">
        <li className="flex items-start gap-3 text-secondary text-sm">
          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">1</span>
          <span>Click on the provided endpoint URL to copy it to your clipboard.</span>
        </li>
        <li className="flex items-start gap-3 text-secondary text-sm">
          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">2</span>
          <span>Configure your wallet or dApp with the RPC endpoint.</span>
        </li>
        <li className="flex items-start gap-3 text-secondary text-sm">
          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">3</span>
          <span>For real-time updates, use the WebSocket endpoint.</span>
        </li>
      </ul>
    </div>
  );
}
