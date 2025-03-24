import React from "react";
import NodeStatus from "./components/NodeStatus";
import ConnectionInfo from "./components/ConnectionInfo";
import UsageGuide from "./components/UsageGuide";
import SecurityInfo from "./components/SecurityInfo";

export default function NodePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Public Node Information</h1>
      <NodeStatus />
      <ConnectionInfo />
      <UsageGuide />
      <SecurityInfo />
    </div>
  );
}