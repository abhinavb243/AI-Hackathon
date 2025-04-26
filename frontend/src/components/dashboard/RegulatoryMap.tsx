
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

type Regulation = {
  id: string;
  name: string;
  region: string;
  status: "active" | "pending" | "proposed";
  impact: "high" | "medium" | "low";
};

type RegulatoryMapProps = {
  regulations: Regulation[];
};

export function RegulatoryMap({ regulations }: RegulatoryMapProps) {
  const getImpactBadge = (impact: Regulation["impact"]) => {
    switch (impact) {
      case "high":
        return <Badge variant="destructive">High Impact</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-privacy-warning/20 text-privacy-warning border-privacy-warning">Medium Impact</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-privacy-success/20 text-privacy-success border-privacy-success">Low Impact</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText size={18} />
          <span>Regulatory Map</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-80 overflow-y-auto">
        <div className="space-y-4">
          {regulations.map((regulation) => (
            <div 
              key={regulation.id} 
              className="p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{regulation.name}</h3>
                {getImpactBadge(regulation.impact)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Region: {regulation.region}
              </p>
              <p className="text-xs mt-1">
                Status: <span className="font-medium capitalize">{regulation.status}</span>
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
