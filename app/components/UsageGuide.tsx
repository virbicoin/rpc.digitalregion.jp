"use client";

import React from "react";

const UsageGuide: React.FC = () => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold">Usage Guide</h2>
      <p className="mt-2">
        To connect to the node, use the RPC URL provided above. Ensure your client is configured to handle JSON-RPC requests.
      </p>
      <p className="mt-2">
        For WebSocket connections, use the WebSocket URL for real-time data streaming.
      </p>
    </div>
  );
};

export default UsageGuide;