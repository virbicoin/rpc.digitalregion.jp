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

const ConnectionInfo: React.FC = () => {
  const [endpointStatus, setEndpointStatus] = useState<EndpointStatus>({
    rpc: { isAlive: false, lastChecked: '' },
    websocket: { isAlive: false, lastChecked: '' }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkEndpoints = async () => {
      const now = new Date();
      const lastChecked = new Intl.DateTimeFormat(undefined, {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(now);

      try {
        // RPCエンドポイントのチェック
        const rpcRes = await fetch('https://rpc.digitalregion.jp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_blockNumber',
            params: []
          })
        });
        const rpcIsAlive = rpcRes.ok;

        // WebSocketエンドポイントのチェック
        const ws = new WebSocket('wss://ws.digitalregion.jp');
        const wsCheck = new Promise<boolean>((resolve) => {
          ws.onopen = () => {
            ws.close();
            resolve(true);
          };
          ws.onerror = () => resolve(false);
          setTimeout(() => resolve(false), 5000);
        });

        const wsIsAlive = await wsCheck;

        setEndpointStatus({
          rpc: { isAlive: rpcIsAlive, lastChecked },
          websocket: { isAlive: wsIsAlive, lastChecked }
        });
        setLoading(false);
      } catch (error) {
        console.error("Error checking endpoints:", error);
        setEndpointStatus({
          rpc: { isAlive: false, lastChecked },
          websocket: { isAlive: false, lastChecked }
        });
        setLoading(false);
      }
    };

    checkEndpoints();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md max-w-screen-lg mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-semibold text-gray-700 animate-pulse">
            Loading Endpoint Status...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md max-w-screen-lg mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Endpoint Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* RPC Endpoint */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-semibold text-gray-700">
              <span className="inline-flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                RPC Endpoint
              </span>
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${endpointStatus.rpc.isAlive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {endpointStatus.rpc.isAlive ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            Last checked: {endpointStatus.rpc.lastChecked}
          </p>
          <div className="flex items-center justify-between">
            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">
              https://rpc.digitalregion.jp
            </code>
            <button
              onClick={() => navigator.clipboard.writeText('https://rpc.digitalregion.jp')}
              className="text-gray-500 hover:text-gray-700 ml-2"
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
        </div>
        {/* WebSocket Endpoint */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-semibold text-gray-700">
              <span className="inline-flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                WebSocket Endpoint
              </span>
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${endpointStatus.websocket.isAlive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {endpointStatus.websocket.isAlive ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            Last checked: {endpointStatus.websocket.lastChecked}
          </p>
          <div className="flex items-center justify-between">
            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">
              wss://ws.digitalregion.jp
            </code>
            <button
              onClick={() => navigator.clipboard.writeText('wss://ws.digitalregion.jp')}
              className="text-gray-500 hover:text-gray-700 ml-2"
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600">
          Use the above URLs to connect to the node. Ensure your client supports JSON-RPC and WebSocket protocols.
        </p>
      </div>
    </div>
  );
};

export default ConnectionInfo;