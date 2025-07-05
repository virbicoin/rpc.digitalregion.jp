"use client";

import { useState, useEffect } from "react";

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

const CACHE_DURATION = 5 * 60 * 1000; // 5分（ミリ秒）

const NodeStatus: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [statusData, setStatusData] = useState<Record<number, NodeStatus>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // ノード一覧の取得
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        // キャッシュをチェック
        const cachedNodes = localStorage.getItem("nodes");
        const cachedNodesTimestamp = localStorage.getItem("nodesTimestamp");

        if (cachedNodes && cachedNodesTimestamp) {
          const timestamp = parseInt(cachedNodesTimestamp);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setNodes(JSON.parse(cachedNodes));
            return;
          }
        }

        const res = await fetch("/api/nodes");
        if (!res.ok) throw new Error(`Failed to fetch nodes: ${res.status}`);
        const data = await res.json();
        const formattedNodes = Object.keys(data).map((name, index) => ({
          id: index + 1,
          name,
        }));

        // キャッシュに保存
        localStorage.setItem("nodes", JSON.stringify(formattedNodes));
        localStorage.setItem("nodesTimestamp", Date.now().toString());

        setNodes(formattedNodes);
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };

    fetchNodes();
  }, []);

  // ノードステータスの取得
  useEffect(() => {
    const fetchAllNodes = async () => {
      if (nodes.length === 0) return;
      setLoading(true);

      // キャッシュをチェック
      const cachedStatus = localStorage.getItem("nodeStatus");
      const cachedStatusTimestamp = localStorage.getItem("nodeStatusTimestamp");

      if (cachedStatus && cachedStatusTimestamp) {
        const timestamp = parseInt(cachedStatusTimestamp);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setStatusData(JSON.parse(cachedStatus));
          setLoading(false);
          return;
        }
      }

      const updatedStatusData: Record<number, NodeStatus> = {};

      const fetchPromises = nodes.map(async (node) => {
        try {
          const encodedNodeName = encodeURIComponent(node.name);
          const res = await fetch(`/api/nodes/${encodedNodeName}`);
          if (!res.ok)
            throw new Error(
              `Failed to fetch data for node ${node.name}: ${res.status}`,
            );

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
            clientVersion: "Unknown",
          };
        }
      });

      await Promise.allSettled(fetchPromises);

      // キャッシュに保存
      localStorage.setItem("nodeStatus", JSON.stringify(updatedStatusData));
      localStorage.setItem("nodeStatusTimestamp", Date.now().toString());

      setStatusData(updatedStatusData);
      setLoading(false);
    };

    fetchAllNodes();
  }, [nodes]);

  if (loading) {
    return (
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md max-w-screen-lg mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Node Status
        </h2>
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-semibold text-gray-700 animate-pulse">
            Loading Node Status...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Node Status
      </h2>
      <div className="bg-gray-50 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Server
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Running
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Height
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Peers
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Version
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Last Checked
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {nodes && nodes.length > 0 ? (
                nodes.map((node) => (
                  <tr
                    key={node.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-900 font-bold">
                      <span className="inline-flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        <span className="font-mono">{node.name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {statusData[node.id]?.isServerRunning === null ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Loading...
                        </span>
                      ) : statusData[node.id]?.isServerRunning ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Offline
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-mono">
                      {statusData[node.id]?.blockHeight ?? "Loading..."}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-mono">
                      {statusData[node.id]?.peers ?? "Loading..."}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-mono whitespace-nowrap">
                      {statusData[node.id]?.clientVersion ?? "Loading..."}
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono whitespace-nowrap">
                      {statusData[node.id]?.lastChecked ?? "Loading..."}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    No nodes available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NodeStatus;
