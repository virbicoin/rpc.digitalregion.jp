"use client";

import { useState, useEffect } from "react";

interface EndpointStatus {
  rpc: {
    isAlive: boolean;
    lastChecked: string;
  };
  websocket: {
    isAlive: boolean;
    lastChecked: string;
  };
}

const CACHE_DURATION = 5 * 60 * 1000; // 5分（ミリ秒）

export default function ConnectionInfo() {
  const [endpointStatus, setEndpointStatus] = useState<EndpointStatus>({
    rpc: { isAlive: false, lastChecked: "" },
    websocket: { isAlive: false, lastChecked: "" },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEndpoints = async () => {
      // キャッシュをチェック
      const cachedStatus = localStorage.getItem("endpointStatus");
      const cachedStatusTimestamp = localStorage.getItem(
        "endpointStatusTimestamp",
      );

      if (cachedStatus && cachedStatusTimestamp) {
        const timestamp = parseInt(cachedStatusTimestamp);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setEndpointStatus(JSON.parse(cachedStatus));
          setLoading(false);
          return;
        }
      }

      const now = new Date();
      const lastChecked = new Intl.DateTimeFormat(undefined, {
        dateStyle: "short",
        timeStyle: "long",
      }).format(now);

      try {
        // RPCエンドポイントのチェック
        const rpcRes = await fetch("https://rpc.digitalregion.jp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_blockNumber",
            params: [],
          }),
        });
        const rpcIsAlive = rpcRes.ok;

        // WebSocketエンドポイントのチェック
        const ws = new WebSocket("wss://ws.digitalregion.jp");
        const wsCheck = new Promise<boolean>((resolve) => {
          ws.onopen = () => {
            ws.close();
            resolve(true);
          };
          ws.onerror = () => resolve(false);
          setTimeout(() => resolve(false), 5000);
        });

        const wsIsAlive = await wsCheck;

        const newStatus = {
          rpc: { isAlive: rpcIsAlive, lastChecked },
          websocket: { isAlive: wsIsAlive, lastChecked },
        };

        // キャッシュに保存
        localStorage.setItem("endpointStatus", JSON.stringify(newStatus));
        localStorage.setItem("endpointStatusTimestamp", Date.now().toString());

        setEndpointStatus(newStatus);
        setLoading(false);
      } catch (error) {
        console.error("Error checking endpoints:", error);
        const newStatus = {
          rpc: { isAlive: false, lastChecked },
          websocket: { isAlive: false, lastChecked },
        };

        // エラー時もキャッシュに保存（エラー状態をキャッシュ）
        localStorage.setItem("endpointStatus", JSON.stringify(newStatus));
        localStorage.setItem("endpointStatusTimestamp", Date.now().toString());

        setEndpointStatus(newStatus);
        setLoading(false);
      }
    };

    checkEndpoints();
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-primary">Connection Endpoints</h2>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-muted animate-pulse">
            Checking Endpoints...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-primary">Connection Endpoints</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* RPC Endpoint */}
        <div className="endpoint-card rounded-xl p-5 border transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-2 text-primary font-medium">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              RPC Endpoint
            </span>
            <span className={endpointStatus.rpc.isAlive ? "status-online" : "status-offline"} style={{padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 500}}>
              {endpointStatus.rpc.isAlive ? "Online" : "Offline"}
            </span>
          </div>
          <div className="code-block rounded-lg p-3 flex items-center justify-between group">
            <code className="text-sm font-mono text-secondary">
              https://rpc.digitalregion.jp
            </code>
            <button
              onClick={() => navigator.clipboard.writeText("https://rpc.digitalregion.jp")}
              className="text-muted hover:text-blue-400 transition-colors p-1"
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-muted mt-2">
            Last checked: {endpointStatus.rpc.lastChecked}
          </p>
        </div>

        {/* WebSocket Endpoint */}
        <div className="endpoint-card rounded-xl p-5 border transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-2 text-primary font-medium">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              WebSocket Endpoint
            </span>
            <span className={endpointStatus.websocket.isAlive ? "status-online" : "status-offline"} style={{padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 500}}>
              {endpointStatus.websocket.isAlive ? "Online" : "Offline"}
            </span>
          </div>
          <div className="code-block rounded-lg p-3 flex items-center justify-between group">
            <code className="text-sm font-mono text-secondary">
              wss://ws.digitalregion.jp
            </code>
            <button
              onClick={() => navigator.clipboard.writeText("wss://ws.digitalregion.jp")}
              className="text-muted hover:text-purple-400 transition-colors p-1"
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-muted mt-2">
            Last checked: {endpointStatus.websocket.lastChecked}
          </p>
        </div>
      </div>

      <div className="info-banner rounded-lg p-4">
        <p className="text-sm text-secondary flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Use these endpoints to connect to the VirBiCoin network. Ensure your client supports JSON-RPC and WebSocket protocols.
        </p>
      </div>
    </div>
  );
}
