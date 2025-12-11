"use client";

import { useState, useEffect } from "react";

interface Node {
  id: number;
  name: string;
}

interface NodeStatusData {
  lastChecked: string;
  blockHeight: number | null;
  peers: number | null;
  isServerRunning: boolean | null;
  clientVersion: string | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5分（ミリ秒）

export default function NodeStatus() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [statusData, setStatusData] = useState<Record<number, NodeStatusData>>({});
  const [loading, setLoading] = useState(true);

  // ブラウザのロケールとタイムゾーンを取得
  const locale = typeof window !== 'undefined' ? navigator.language : 'en-US';
  const timeZone = typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';

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

      const updatedStatusData: Record<number, NodeStatusData> = {};

      const fetchPromises = nodes.map(async (node) => {
        try {
          const encodedNodeName = encodeURIComponent(node.name);
          const res = await fetch(`/api/nodes/${encodedNodeName}`);
          
          if (!res.ok) {
            // 502, 503は特別な処理
            if (res.status === 502 || res.status === 503) {
              throw new Error(`Node ${node.name} is temporarily unavailable (${res.status})`);
            }
            throw new Error(
              `Failed to fetch data for node ${node.name}: ${res.status}`,
            );
          }

          const data = await res.json();
          
          // エラーレスポンスの場合は例外を投げる
          if (data.error) {
            throw new Error(data.error);
          }
          
          const formattedVersion =
            data.clientVersion?.split("/").slice(0, 2).join("/") || "Unknown";
          const now = new Date();
          const lastChecked = new Intl.DateTimeFormat(locale, {
            dateStyle: 'short',
            timeStyle: 'long',
            timeZone,
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
          const lastChecked = new Intl.DateTimeFormat(locale, {
            dateStyle: 'short',
            timeStyle: 'long',
            timeZone,
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
  }, [nodes, locale, timeZone]);

  // Healthチェック（Healthy, ホストネーム, 時刻）
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/health');
        const data = await res.json();
        console.log('Health:', data.status);
        console.log('Hostname:', data.hostname);
        // 日時をブラウザロケール・タイムゾーンで表示
        const healthTime = new Date(data.time);
        const formattedHealthTime = new Intl.DateTimeFormat(locale, {
          dateStyle: 'short',
          timeStyle: 'long',
          timeZone,
        }).format(healthTime);
        console.log('Time:', formattedHealthTime);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };
    fetchHealth();
  }, [locale, timeZone]);

  if (loading) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-primary">Node Status</h2>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-muted animate-pulse">
            Loading Node Status...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-primary">Node Status</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Server</th>
              <th>Status</th>
              <th>Block Height</th>
              <th>Peers</th>
              <th>Version</th>
              <th>Last Checked</th>
            </tr>
          </thead>
          <tbody>
            {nodes && nodes.length > 0 ? (
              nodes.map((node) => (
                <tr key={node.id}>
                  <td>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                      <span className="font-mono font-medium text-primary">{node.name}</span>
                    </span>
                  </td>
                  <td>
                    {statusData[node.id]?.isServerRunning === null ? (
                      <span className="status-loading inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                        Loading...
                      </span>
                    ) : statusData[node.id]?.isServerRunning ? (
                      <span className="status-online inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
                        Online
                      </span>
                    ) : (
                      <span className="status-offline inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5"></span>
                        Offline
                      </span>
                    )}
                  </td>
                  <td className="font-mono text-secondary">
                    {statusData[node.id]?.blockHeight?.toLocaleString() ?? "—"}
                  </td>
                  <td className="font-mono text-secondary">
                    {statusData[node.id]?.peers ?? "—"}
                  </td>
                  <td className="font-mono text-secondary whitespace-nowrap">
                    {statusData[node.id]?.clientVersion ?? "—"}
                  </td>
                  <td className="text-muted text-sm whitespace-nowrap">
                    {statusData[node.id]?.lastChecked ?? "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-muted py-8">
                  No nodes available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
