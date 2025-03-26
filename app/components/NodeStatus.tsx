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
        blockHeight: number | null;
        peers: number | null;
        isServerRunning: boolean | null;
        clientVersion: string | null;
        clientName: string | null;
      } | null
    >
  >({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const clearCache = () => {
      console.log("Clearing cache...");
      localStorage.removeItem("nodeStatusData");
      localStorage.removeItem("lastUpdated");
    };

    const fetchNodeStatus = async (node: Node, signal: AbortSignal): Promise<{
      lastChecked: string;
      blockHeight: number;
      peers: number;
      isServerRunning: boolean;
      clientVersion: string;
      clientName: string;
    } | null> => {
      let retries = 5; // 最大再試行回数
      while (retries > 0) {
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
            signal,
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
            signal,
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
            signal,
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
            signal,
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
          retries -= 1;
          if (retries === 0) {
            console.error("Failed to connect to Geth after multiple retries.");
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
          console.log(`Retrying... (${3 - retries} of 3)`);
          await new Promise((resolve) => setTimeout(resolve, 5000)); // 5秒待機
        }
      }
      return null;
    };

    const fetchAllNodes = async () => {
      console.log("Fetching all nodes...");
      setLoading(true);

      // 初期状態で全てのノードをローディング中に設定
      nodes.forEach((node) => {
        setStatusData((prevStatusData) => ({
          ...prevStatusData,
          [node.id]: {
            isServerRunning: null, // ローディング中を示す
            lastChecked: "Loading...",
            blockHeight: null,
            peers: null,
            clientName: "Loading...",
            clientVersion: "Loading...",
          },
        }));
      });

      const fetchedData: Record<
        number,
        {
          lastChecked: string;
          blockHeight: number | null;
          peers: number | null;
          isServerRunning: boolean | null;
          clientVersion: string | null;
          clientName: string | null;
        } | null
      > = {};

      const promises = nodes.map(async (node) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // タイムアウトを10秒に設定

          const data = await fetchNodeStatus(node, controller.signal);
          clearTimeout(timeoutId);

          // フェッチできたデータを一時保存
          fetchedData[node.id] = data;

          // フェッチできたサーバーを逐次表示
          setStatusData((prevStatusData) => ({
            ...prevStatusData,
            [node.id]: data,
          }));
        } catch (error) {
          console.error(`Error fetching data for node: ${node.name}`, error);

          // タイムアウトやエラー時もデフォルト値を設定
          const now = new Date();
          const lastChecked = new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "medium",
          }).format(now);

          const defaultData = {
            isServerRunning: false,
            lastChecked,
            blockHeight: 0,
            peers: 0,
            clientName: "Unknown",
            clientVersion: "Unknown",
          };

          fetchedData[node.id] = defaultData;

          setStatusData((prevStatusData) => ({
            ...prevStatusData,
            [node.id]: defaultData,
          }));
        }
      });

      await Promise.all(promises); // 全てのフェッチ処理を並行して実行

      // 最終更新時刻を設定
      const now = new Date();
      const formattedTime = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "medium",
      }).format(now);

      // キャッシュに保存
      localStorage.setItem("nodeStatusData", JSON.stringify(fetchedData));
      localStorage.setItem("lastUpdated", formattedTime);

      setLoading(false); // ローディング状態を解除
    };

    const loadFromCache = () => {
      console.log("Loading data from cache...");
      const cachedData = localStorage.getItem("nodeStatusData");
      const cachedLastUpdated = localStorage.getItem("lastUpdated");

      if (cachedData && cachedLastUpdated) {
        console.log("Cache found");
        const parsedData = JSON.parse(cachedData);

        const lastUpdatedTime = new Date(cachedLastUpdated).getTime();
        const currentTime = new Date().getTime();
        const isCacheOutdated = currentTime - lastUpdatedTime > 10 * 60 * 1000; // 10分以上経過しているか

        if (isCacheOutdated) {
          console.log("Cache is outdated, forcing fetch...");
          fetchAllNodes();
        } else {
          setStatusData(parsedData); // キャッシュデータをUIに反映
          setLoading(false); // キャッシュが有効な場合、ローディング状態を解除
        }
      } else {
        console.log("No cache found, fetching data...");
        fetchAllNodes();
      }
    };

    // 開発環境またはビルド後の実行時にキャッシュをクリア
    if (process.env.NODE_ENV === "development") {
      clearCache();
    }

    if (process.env.NODE_ENV === "production" && !localStorage.getItem("cacheCleared")) {
      clearCache();
      localStorage.setItem("cacheCleared", "true"); // キャッシュクリア済みフラグを設定
    }

    // キャッシュからデータをロード
    loadFromCache();

    // 10分ごとに更新
    const interval = setInterval(fetchAllNodes, 10 * 60 * 1000);
    return () => clearInterval(interval); // クリーンアップ関数を返す
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-semibold text-gray-700">Loading Node Status...</div>;
  }

  return (
    <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Nodes Status</h2>
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
                  {statusData[node.id]?.isServerRunning === null ? (
                    <span className="text-yellow-600 font-semibold">Loading...</span>
                  ) : statusData[node.id]?.isServerRunning ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-semibold">No</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {statusData[node.id]?.blockHeight ?? "Loading..."}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {statusData[node.id]?.peers ?? "Loading..."}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {statusData[node.id]?.clientName ?? "Loading..."}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {statusData[node.id]?.clientVersion ?? "Loading..."}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {statusData[node.id]?.lastChecked ?? "Loading..."}
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