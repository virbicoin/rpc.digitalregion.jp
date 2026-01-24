import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { nodes } from "@/app/api/nodes/data";

const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number,
) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// リトライ機能付きRPCリクエスト
const fetchRpcWithRetry = async (
  url: string,
  payload: { jsonrpc: string; id: number; method: string; params?: unknown[] },
  maxRetries: number = 2,
  timeout: number = 5000,
) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        timeout,
      );

      if (!res.ok) {
        throw new Error(`RPC request failed with status ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      // リトライ前に少し待機
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ NODE_NAME: string }> }
) {
  const { NODE_NAME: nodeName } = await params;
  const nodeUrl = nodes[nodeName];

  if (!nodeUrl) {
    return NextResponse.json({ error: "Node not found" }, { status: 404 });
  }

  const rpcPayloads = [
    {
      jsonrpc: "2.0",
      method: "web3_clientVersion",
      params: [],
      id: 1,
    },
    {
      jsonrpc: "2.0",
      method: "eth_blockNumber",
      params: [],
      id: 2,
    },
    {
      jsonrpc: "2.0",
      method: "net_peerCount",
      params: [],
      id: 3,
    },
    {
      jsonrpc: "2.0",
      method: "net_listening",
      params: [],
      id: 4,
    },
  ];

  try {
    // 個別のRPCリクエストを並行実行し、失敗を許容
    const responses = await Promise.allSettled(
      rpcPayloads.map(async (payload, index) => {
        try {
          return await fetchRpcWithRetry(nodeUrl, payload, 2, 5000);
        } catch (error) {
          console.error(`RPC request ${index + 1} failed for node ${nodeName}:`, error);
          return null;
        }
      })
    );

    // 各レスポンスを安全に処理
    const clientVersion = responses[0]?.status === 'fulfilled' && responses[0].value?.result
      ? responses[0].value.result
      : "Unknown";

    const blockHeight = responses[1]?.status === 'fulfilled' && responses[1].value?.result
      ? parseInt(responses[1].value.result, 16)
      : 0;
    const peers = responses[2]?.status === 'fulfilled' && responses[2].value?.result
      ? parseInt(responses[2].value.result, 16)
      : 0;
    
    // net_listeningが利用可能な場合はその結果を使用
    // 利用不可（-32601エラー）の場合は、他のRPCが成功していればオンラインと判定
    const netListeningResponse = responses[3]?.status === 'fulfilled' ? responses[3].value : null;
    const netListeningAvailable = netListeningResponse && !netListeningResponse.error;
    const netListening = netListeningAvailable && netListeningResponse.result === true;
    
    // eth_blockNumberが正常に取得できていればノードは稼働中
    const blockNumberSuccess = responses[1]?.status === 'fulfilled' && 
      responses[1].value?.result !== undefined && 
      !responses[1].value?.error;
    
    const isServerRunning = netListeningAvailable ? netListening : blockNumberSuccess;

    return NextResponse.json({
      clientVersion,
      blockHeight,
      peers,
      isServerRunning,
    });
  } catch (error) {
    console.error(`Node ${nodeName} request failed:`, error);
    return NextResponse.json(
      {
        error: "Node temporarily unavailable",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 503 }
    );
  }
}
