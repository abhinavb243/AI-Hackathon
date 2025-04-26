
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "deadline" | "update" | "task";
};

type ComplianceTimelineProps = {
  events: TimelineEvent[];
};

export function ComplianceTimeline({ events }: ComplianceTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar size={18} />
          <span>Compliance Timeline</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-80 overflow-y-auto pr-2">
        <div className="relative pl-6 border-l border-muted">
          {events.map((event) => (
            <div key={event.id} className="mb-6 relative">
              <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-white border-2 border-privacy-primary"></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>{event.date}</span>
              </div>
              <h3 className="text-base font-medium mt-1">{event.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
