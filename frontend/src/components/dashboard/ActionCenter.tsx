
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ListChecks } from "lucide-react";
import { useState } from "react";

type TaskItem = {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  completed: boolean;
};

type ActionCenterProps = {
  tasks: TaskItem[];
  onTaskToggle: (id: string, checked: boolean) => void;
};

export function ActionCenter({ tasks, onTaskToggle }: ActionCenterProps) {
  const getPriorityClass = (priority: TaskItem["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-privacy-danger/10 border-privacy-danger/30";
      case "medium":
        return "bg-privacy-warning/10 border-privacy-warning/30";
      case "low":
        return "bg-privacy-success/10 border-privacy-success/30";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ListChecks size={18} />
          <span>Action Center</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`p-3 border rounded-md ${getPriorityClass(task.priority)} ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <Checkbox 
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={(checked) => 
                    onTaskToggle(task.id, checked as boolean)
                  }
                />
                <div className="flex-1">
                  <label 
                    htmlFor={`task-${task.id}`}
                    className={`font-medium cursor-pointer ${
                      task.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.title}
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs">Due: {task.dueDate}</span>
                    <Button variant="outline" size="sm">Details</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
