"use client";

export default function SecurityInfo() {
  return (
    <div className="glass-card p-6 animate-fade-in h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-primary">Security Tips</h2>
      </div>
      <ul className="space-y-3">
        <li className="flex items-start gap-3 text-secondary text-sm">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Always verify URLs start with <code className="text-blue-500 bg-blue-500/10 px-1 rounded">https://</code> or <code className="text-purple-500 bg-purple-500/10 px-1 rounded">wss://</code></span>
        </li>
        <li className="flex items-start gap-3 text-secondary text-sm">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Keep your wallet software updated to the latest version.</span>
        </li>
        <li className="flex items-start gap-3 text-secondary text-sm">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Never share your private keys or seed phrases with anyone.</span>
        </li>
      </ul>
    </div>
  );
}
