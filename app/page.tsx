import NodeStatus from "@/app/components/NodeStatus";
import ConnectionInfo from "@/app/components/ConnectionInfo";
import UsageGuide from "@/app/components/UsageGuide";
import SecurityInfo from "@/app/components/SecurityInfo";

export default function NodePage() {
  return (
    <div className="space-y-6">
      <NodeStatus />
      <ConnectionInfo />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UsageGuide />
        <SecurityInfo />
      </div>
    </div>
  );
}
