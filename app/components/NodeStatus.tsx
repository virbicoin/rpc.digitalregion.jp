"use client";

import React, { useState, useEffect } from "react";

interface Node {
  id: number;
  name: string;
}

interface NodeStatus {
  lastChecked: string;
  blockHeight: number | null;
  peers: number | null;
  isServerRunning: boolean | null;
  clientVersion: string | null;
}

const NodeStatus: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [statusData, setStatusData] = useState<Record<number, NodeStatus>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const res = await fetch('/api/nodes');
        if (!res.ok) {
          throw new Error(`Failed to fetch nodes: ${res.status}`);
        }
        const data = await res.json();
        const formattedNodes = Object.keys(data).map((name, index) => ({
          id: index + 1,
          name,
        }));
        setNodes(formattedNodes);
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };

    fetchNodes();
  }, []);

  useEffect(() => {
    const loadFromCache = () => {
      if (process.env.NODE_ENV === "development") {
        console.log("Development environment detected, skipping cache...");
        fetchAllNodes(); // NODE_ENVがdevelopmentの場合はキャッシュをスキップして最新データを取得
        return;
      }

      console.log("Loading data from cache...");
      const cachedData = localStorage.getItem("nodeStatusData");
      const cachedLastUpdated = localStorage.getItem("lastUpdated");

      if (cachedData && cachedLastUpdated) {
        const lastUpdatedTime = new Date(cachedLastUpdated).getTime();
        const currentTime = new Date().getTime();
        const isCacheOutdated = currentTime - lastUpdatedTime > 5 * 60 * 1000; // 5分以上経過しているか

        if (isCacheOutdated) {
          console.log("Cache is outdated, fetching new data...");
          fetchAllNodes();
        } else {
          console.log("Using cached data...");
          setStatusData(JSON.parse(cachedData));
          setLoading(false);
        }
      } else {
        console.log("No cache found, fetching new data...");
        fetchAllNodes();
      }
    };

    const fetchAllNodes = async () => {
      console.log("Fetching all nodes...");
      setLoading(true);
    
      const updatedStatusData: Record<number, NodeStatus> = {};
    
      // 各ノードごとに個別の fetch 処理を行う
      const fetchPromises = nodes.map(async (node) => {
        try {
          const encodedNodeName = encodeURIComponent(node.name);
          const res = await fetch(`/api/nodes/${encodedNodeName}`);
          if (!res.ok) {
            throw new Error(`Failed to fetch data for node ${node.name}: ${res.status}`);
          }
          const data = await res.json();
    
          const formattedVersion =
            data.clientVersion?.split("/").slice(0, 2).join("/") || "Unknown";
          const now = new Date();
          const lastChecked = new Intl.DateTimeFormat(undefined, {
            dateStyle: "short",
            timeStyle: "medium",
          }).format(now);
    
          updatedStatusData[node.id] = {
            lastChecked,
            blockHeight: data.blockHeight || 0,
            peers: data.peers || 0,
            isServerRunning: data.isServerRunning || false,
            clientVersion: formattedVersion,
          };
        } catch (error) {
          console.error(`Error fetching data for node ${node.name}:`, error);
          const now = new Date();
          const lastChecked = new Intl.DateTimeFormat(undefined, {
            dateStyle: "short",
            timeStyle: "medium",
          }).format(now);
          updatedStatusData[node.id] = {
            lastChecked,
            blockHeight: 0,
            peers: 0,
            isServerRunning: false,
            clientVersion: `Unknown`,
          };
        }
      });
    
      // Promise.allSettled で全ての処理が完了するのを待つ
      await Promise.allSettled(fetchPromises);
    
      setStatusData(updatedStatusData);
    
      // キャッシュに保存
      localStorage.setItem("nodeStatusData", JSON.stringify(updatedStatusData));
      localStorage.setItem("lastUpdated", new Date().toISOString());
    
      console.log("All nodes fetched successfully.");
      setLoading(false);
    };

    if (nodes.length > 0) {
      loadFromCache();
    }
  }, [nodes]);

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
