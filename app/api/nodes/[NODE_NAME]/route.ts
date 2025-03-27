import { NextRequest, NextResponse } from 'next/server';
import { nodes } from '../data';

const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

export async function GET(request: NextRequest, context: unknown) {
    const { params } = context as { params: { NODE_NAME: string } };
    const nodeName = params.NODE_NAME;
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
        const responses = await Promise.all(
            rpcPayloads.map(async (payload) => {
                const res = await fetchWithTimeout(
                    nodeUrl,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    },
                    3000 // タイムアウトを3秒に設定
                );
                if (!res.ok) {
                    throw new Error(`RPC request failed with status ${res.status}`);
                }
                return res.json();
            })
        );

        const clientVersion = responses[0]?.result || "Unknown";
        const blockHeight = responses[1]?.result ? parseInt(responses[1].result, 16) : 0;
        const peers = responses[2]?.result ? parseInt(responses[2].result, 16) : 0;
        const netListening = responses[3]?.result === true;
        const isServerRunning = netListening;

        return NextResponse.json({
            clientVersion,
            blockHeight,
            peers,
            isServerRunning,
        });
    } catch {
        return NextResponse.json({ status: 500 });
    }
}
