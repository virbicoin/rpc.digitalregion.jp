import React from "react";
import NodeStatus from "./components/NodeStatus";
import ConnectionInfo from "./components/ConnectionInfo";
import UsageGuide from "./components/UsageGuide";
import SecurityInfo from "./components/SecurityInfo";

export default function NodePage() {
  return (
    <div className="p-6 bg-gray-950 min-h-screen text-gray-100">
      <div className="max-w-screen-lg mx-auto">
        <NodeStatus />
        <ConnectionInfo />
        <UsageGuide />
        <SecurityInfo />
      </div>
    </div>
  );
}