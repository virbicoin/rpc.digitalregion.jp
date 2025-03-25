"use client";

import React from "react";

const ConnectionInfo: React.FC = () => {
  const connectionData = {
    rpcUrl: "https://rpc.digitalregion.jp",
    websocketUrl: "wss://rpc.digitalregion.jp",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Connection Information</h2>
      <table className="table-auto w-full border-collapse border border-gray-300 bg-gray-50">
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 text-gray-700 font-semibold">RPC URL</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-700">{connectionData.rpcUrl}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 text-gray-700 font-semibold">WebSocket URL</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-700">{connectionData.websocketUrl}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4 text-gray-700">
        Use the above URLs to connect to the node. Ensure your client supports JSON-RPC and WebSocket protocols.
      </p>
    </div>
  );
};

export default ConnectionInfo;