"use client";

import React from "react";

const ConnectionInfo: React.FC = () => {
  const connectionData = {
    rpcUrl: "https://rpc.digitalregion.jp",
    websocketUrl: "wss://rpc.digitalregion.jp",
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold">Connection Information</h2>
      <ul className="mt-2">
        <li>RPC URL: {connectionData.rpcUrl}</li>
        <li>WebSocket URL: {connectionData.websocketUrl}</li>
      </ul>
    </div>
  );
};

export default ConnectionInfo;