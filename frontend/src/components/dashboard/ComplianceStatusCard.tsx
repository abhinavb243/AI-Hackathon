
import { ReactNode } from "react";
import { Check, AlertTriangle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ComplianceStatus = "compliant" | "warning" | "critical";

type ComplianceStatusCardProps = {
  title: string;
  status: ComplianceStatus;
  description: string;
  value: string | ReactNode;
  trend?: "up" | "down" | "stable";
  onClick?: () => void;
};

export function ComplianceStatusCard({
  title,
  status,
  description,
  value,
  trend,
  onClick,
}: ComplianceStatusCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "compliant":
        return <Check className="h-5 w-5 text-privacy-success" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-privacy-warning" />;
      case "critical":
        return <AlertCircle className="h-5 w-5 text-privacy-danger" />;
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case "compliant":
        return "border-l-privacy-success";
      case "warning":
        return "border-l-privacy-warning";
      case "critical":
        return "border-l-privacy-danger";
    }
  };

  return (
    <Card 
      className={cn(
        "border-l-4 transition-all hover:shadow-md cursor-pointer",
        getStatusClass()
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div>{getStatusIcon()}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
