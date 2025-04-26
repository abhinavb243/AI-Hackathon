import { useState } from "react";
import { 
  ComplianceStatusCard,
  ComplianceTimeline,
  RegulatoryMap,
  ActionCenter,
} from "@/components/dashboard";

// Define the type for timeline events
type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "deadline" | "task" | "update";
};

// Define the type for regulations
type Regulation = {
  id: string;
  name: string;
  region: string;
  status: "active" | "pending" | "proposed";
  impact: "high" | "medium" | "low";
};

// Define the type for tasks
type TaskItem = {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  completed: boolean;
  redirectPath?: string;  // Add optional redirectPath property
};

// Sample data
const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    title: "CPRA Compliance Deadline",
    description: "California Privacy Rights Act enforcement begins",
    date: "June 30, 2025",
    type: "deadline"
  },
  {
    id: "2",
    title: "GDPR Risk Assessment Update",
    description: "Updated risk assessment required due to recent rulings",
    date: "July 15, 2025",
    type: "task"
  },
  {
    id: "3",
    title: "New Virginia Data Protection Law",
    description: "Virginia Consumer Data Protection Act goes into effect",
    date: "August 1, 2025",
    type: "update"
  },
  {
    id: "4",
    title: "Quarterly Privacy Review",
    description: "Internal review of privacy program effectiveness",
    date: "September 30, 2025",
    type: "task"
  },
];

const regulationsList: Regulation[] = [
  {
    id: "1",
    name: "GDPR",
    region: "European Union",
    status: "active",
    impact: "high"
  },
  {
    id: "2",
    name: "CCPA/CPRA",
    region: "California, USA",
    status: "active",
    impact: "high"
  },
  {
    id: "3",
    name: "PIPEDA",
    region: "Canada",
    status: "active",
    impact: "medium"
  },
  {
    id: "4",
    name: "LGPD",
    region: "Brazil",
    status: "active",
    impact: "medium"
  },
  {
    id: "5",
    name: "CDPA",
    region: "Virginia, USA",
    status: "pending",
    impact: "low"
  },
];

const tasksList: TaskItem[] = [
  {
    id: "1",
    title: "Update Privacy Policy",
    description: "Revise policy to include new CPRA requirements",
    priority: "high",
    dueDate: "May 15, 2025",
    completed: false,
    redirectPath: "/policy-editor"
  },
  {
    id: "2",
    title: "Data Mapping Review",
    description: "Update data inventory with new third-party processors",
    priority: "medium",
    dueDate: "May 20, 2025",
    completed: false,
    redirectPath: "/data-mapping"
  },
  {
    id: "3",
    title: "DPIA for New Marketing Tool",
    description: "Complete Data Protection Impact Assessment",
    priority: "high",
    dueDate: "May 25, 2025",
    completed: false,
    redirectPath: "/dpia-assessment"
  },
  {
    id: "4",
    title: "Employee Training Session",
    description: "Conduct privacy awareness training for new hires",
    priority: "low",
    dueDate: "June 5, 2025",
    completed: true,
    redirectPath: "/training"
  },
];

const Dashboard = () => {
  const [tasks, setTasks] = useState(tasksList);

  const handleTaskToggle = (id: string, checked: boolean) => {
    setTasks(
      tasks.map(task => 
        task.id === id 
          ? { ...task, completed: checked } 
          : task
      )
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Privacy Compliance Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: April 26, 2025
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ComplianceStatusCard
          title="Overall Compliance Status"
          status="warning"
          description="3 high priority tasks require attention"
          value="78%"
        />
        <ComplianceStatusCard
          title="GDPR Compliance"
          status="compliant"
          description="All requirements currently met"
          value="92%"
        />
        <ComplianceStatusCard
          title="CCPA/CPRA Status"
          status="warning"
          description="Privacy policy needs updating"
          value="65%"
        />
        <ComplianceStatusCard
          title="Breach Risk Score"
          status="critical"
          description="Data transfer mechanisms require review"
          value="High"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActionCenter tasks={tasks} onTaskToggle={handleTaskToggle} />
        </div>
        <div className="space-y-6">
          <RegulatoryMap regulations={regulationsList} />
          <ComplianceTimeline events={timelineEvents} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
