"use client";

import React, { useState, useEffect } from "react";

interface JsonRpcResponse {
  jsonrpc: string;
  id: number;
  result?: boolean | string;
}

interface Node {
  id: number;
  name: string;
  url: string;
}

const nodes: Node[] = [
  { id: 1, name: "VirBiCoin Public Node 1", url: "http://localhost:8329" },
  { id: 2, name: "VirBiCoin Boot Node 1", url: "http://localhost:8081" },
  { id: 3, name: "VirBiCoin Boot Node 2", url: "http://localhost:8082" },
  { id: 4, name: "VirBiCoin Boot Node 3", url: "http://localhost:8083" },
];

const NodeStatus: React.FC = () => {
  const [statusData, setStatusData] = useState<
    Record<
      number,
      {
        lastChecked: string;
        blockHeight: number;
        peers: number;
        isServerRunning: boolean;
        clientVersion: string;
        clientName: string;
      } | null
    >
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    const fetchNodeStatus = async (node: Node): Promise<{
      lastChecked: string;
      blockHeight: number;
      peers: number;
      isServerRunning: boolean;
      clientVersion: string;
      clientName: string;
    } | null> => {
      try {
        let isServerRunning = false;
        let clientName = "Unknown";
        let clientVersion = "Unknown";
        let blockHeight = 0;
        let peers = 0;

        // Check if server is running using net_listening
        const netListeningResponse = await fetch(node.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "net_listening",
            params: [],
            id: 0,
          }),
        });

        if (netListeningResponse.ok) {
          const netListeningData: JsonRpcResponse = await netListeningResponse.json();
          isServerRunning = netListeningData.result === true;
        } else {
          isServerRunning = false;
        }

        // Fetch client version using web3_clientVersion
        const clientVersionResponse = await fetch(node.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "web3_clientVersion",
            params: [],
            id: 1,
          }),
        });

        if (clientVersionResponse.ok) {
          const clientVersionData: JsonRpcResponse = await clientVersionResponse.json();
          if (clientVersionData.result && typeof clientVersionData.result === "string") {
            const [name, versionOsGo] = clientVersionData.result.split("/");
            clientName = name;

            const versionOsParts = versionOsGo.split("-");
            if (versionOsParts.length >= 3) {
              const [version] = versionOsParts;
              clientVersion = version;
            } else {
              clientVersion = "Unknown";
            }
          }
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
            id: 2,
          }),
        });

        const blockNumberData: JsonRpcResponse = await blockNumberResponse.json();
        if (blockNumberData.result && typeof blockNumberData.result === "string") {
          blockHeight = parseInt(blockNumberData.result, 16);
        }

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
            id: 3,
          }),
        });

        const peerCountData: JsonRpcResponse = await peerCountResponse.json();
        if (peerCountData.result && typeof peerCountData.result === "string") {
          peers = parseInt(peerCountData.result, 16);
        }

        // Get current timestamp for last checked in local time with timezone
        const now = new Date();
        const lastChecked = new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(now);

        // Return the data
        return { isServerRunning, lastChecked, blockHeight, peers, clientName, clientVersion };
      } catch (err) {
        console.error(`Error fetching data for node ${node.name}:`, err);

        // エラーが発生した場合でも現在の時刻を設定
        const now = new Date();
        const lastChecked = new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(now);

        return {
          isServerRunning: false,
          lastChecked, // 現在の時刻を設定
          blockHeight: 0,
          peers: 0,
          clientName: "Unknown",
          clientVersion: "Unknown",
        };
      }
    };

    const fetchAllNodes = async () => {
      try {
        console.log("Fetching all nodes...");
        setLoading(true);
        const updatedData: Record<
          number,
          {
            lastChecked: string;
            blockHeight: number;
            peers: number;
            isServerRunning: boolean;
            clientVersion: string;
            clientName: string;
          } | null
        > = {};
        await Promise.all(
          nodes.map(async (node) => {
            console.log(`Fetching data for node: ${node.name}`);
            const data = await fetchNodeStatus(node);
            console.log(`Data fetched for node: ${node.name}`, data);
            updatedData[node.id] = data;
          })
        );
        console.log("All nodes fetched:", updatedData);
        setStatusData(updatedData);

        // 最終更新時刻を設定
        const now = new Date();
        const formattedTime = new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(now);
        setLastUpdated(formattedTime);

        // キャッシュに保存
        localStorage.setItem("nodeStatusData", JSON.stringify(updatedData));
        localStorage.setItem("lastUpdated", formattedTime);

        setLoading(false);
        console.log("Loading state set to false");
      } catch (error) {
        console.error("Error in fetchAllNodes:", error);
        setLoading(false); // エラーが発生してもローディング状態を解除
      }
    };

    const loadFromCache = () => {
      console.log("Loading data from cache...");
      const cachedData = localStorage.getItem("nodeStatusData");
      const cachedLastUpdated = localStorage.getItem("lastUpdated");

      if (cachedData && cachedLastUpdated) {
        console.log("Cache found");
        setStatusData(JSON.parse(cachedData));
        setLastUpdated(cachedLastUpdated);
      } else {
        console.log("No cache found");
      }
    };

    const shouldUpdate = () => {
      const cachedLastUpdated = localStorage.getItem("lastUpdated");
      if (!cachedLastUpdated) {
        console.log("No cached lastUpdated found, should update.");
        return true;
      }

      const lastUpdatedTime = new Date(cachedLastUpdated).getTime();
      const currentTime = new Date().getTime();
      const shouldUpdate = currentTime - lastUpdatedTime > 10 * 60 * 1000; // 10分以上経過しているか
      console.log(`Should update: ${shouldUpdate}`);
      return shouldUpdate;
    };

    loadFromCache();

    if (shouldUpdate()) {
      console.log("Cache is outdated, fetching new data...");
      fetchAllNodes();
    } else {
      console.log("Cache is up-to-date, skipping fetch.");
      setLoading(false); // キャッシュが有効な場合、ローディング状態を解除
    }

    // 10分ごとに更新
    const interval = setInterval(fetchAllNodes, 10 * 60 * 1000);
    return () => clearInterval(interval); // クリーンアップ
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-semibold text-gray-700">Loading Node Status...</div>;
  }

  return (
    <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Nodes Status</h2>
      <p className="text-center text-gray-600 mb-4">Last Updated: {lastUpdated}</p>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 bg-gray-50">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-gray-700 font-semibold">Server</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-700 font-semibold">Running</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-700 font-semibold">Height</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-700 font-semibold">Peers</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-700 font-semibold">Client</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-700 font-semibold">Version</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-700 font-semibold">Last Checked</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => (
              <tr key={node.id}>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  <strong>{node.name}</strong>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {statusData[node.id]?.isServerRunning ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-semibold">No</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {statusData[node.id]?.blockHeight ?? "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {statusData[node.id]?.peers ?? "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {statusData[node.id]?.clientName ?? "Unknown"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {statusData[node.id]?.clientVersion ?? "Unknown"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {statusData[node.id]?.lastChecked ?? "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default NodeStatus;