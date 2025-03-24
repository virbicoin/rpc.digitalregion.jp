"use client";

import React, { useState, useEffect } from "react";

interface JsonRpcResponse {
  jsonrpc: string;
  id: number;
  result?: string;
}

interface Node {
  id: number;
  name: string;
  url: string;
}

const nodes: Node[] = [
  { id: 1, name: "VirBiCoin Public Node 1", url: "https://rpc.digitalregion.jp" },
  { id: 2, name: "VirBiCoin Boot Node 1", url: "http://localhost:8081" },
  { id: 3, name: "VirBiCoin Boot Node 2", url: "http://localhost:8082" },
  { id: 4, name: "VirBiCoin Boot Node 3", url: "http://localhost:8083" },
];

const NodeStatus: React.FC = () => {
  const [statusData, setStatusData] = useState<
    Record<number, { lastChecked: string; blockHeight: number; peers: number; isServerRunning: boolean } | null>
  >({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNodeStatus = async (node: Node) => {
      try {
        let isServerRunning = false;

        // Check if server is running
        const serverPingResponse = await fetch(node.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "web3_clientVersion",
            params: [],
            id: 0,
          }),
        });

        if (serverPingResponse.ok) {
          isServerRunning = true;
        } else {
          throw new Error(`Unable to connect to server: ${serverPingResponse.status}`);
        }

        // Fetch block number
        const blockNumberResponse = await fetch(node.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_blockNumber",
            params: [],
            id: 1,
          }),
        });

        const blockNumberData: JsonRpcResponse = await blockNumberResponse.json();
        const blockHeight = parseInt(blockNumberData.result || "0", 16);

        // Fetch peer count
        const peerCountResponse = await fetch(node.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "net_peerCount",
            params: [],
            id: 2,
          }),
        });

        const peerCountData: JsonRpcResponse = await peerCountResponse.json();
        const peers = parseInt(peerCountData.result || "0", 16);

        // Get current timestamp for last checked in local time with timezone
        const now = new Date();
        const lastChecked = new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(now);

        // Update the state
        setStatusData((prev) => ({
          ...prev,
          [node.id]: { isServerRunning, lastChecked, blockHeight, peers },
        }));
      } catch (err) {
        console.error(`Error fetching data for node ${node.name}:`, err);
        setStatusData((prev) => ({
          ...prev,
          [node.id]: null, // Mark this node as failed
        }));
      }
    };

    const fetchAllNodes = async () => {
      setLoading(true);
      await Promise.all(nodes.map((node) => fetchNodeStatus(node)));
      setLoading(false);
    };

    fetchAllNodes();
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-semibold text-gray-700">Loading Node Status...</div>;
  }

  return (
    <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Public Nodes Status</h2>
      {nodes.map((node) => (
        <div key={node.id} className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{node.name}</h3>
          {statusData[node.id] ? (
            <table className="table-auto w-full border-collapse border border-gray-300 bg-gray-50">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Metric</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">Server Running</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {statusData[node.id]?.isServerRunning ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">Last Checked</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">{statusData[node.id]?.lastChecked}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">Block Height</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">{statusData[node.id]?.blockHeight}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">Connected Peers</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">{statusData[node.id]?.peers}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-center text-lg font-semibold text-red-500">
              Failed to fetch data for this node.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default NodeStatus;