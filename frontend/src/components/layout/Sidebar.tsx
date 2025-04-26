
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Settings,
  Calendar,
  Bell,
  Search,
  ListChecks,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavLinkProps = {
  to: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
};

const NavLink = ({ to, icon, title, active }: NavLinkProps) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 my-1",
          active && "bg-privacy-primary/10 text-privacy-primary"
        )}
      >
        {icon}
        <span>{title}</span>
      </Button>
    </Link>
  );
};

type SidebarProps = {
  activePath?: string;
};

export function Sidebar({ activePath = "/" }: SidebarProps) {
  const navItems = [
    { path: "/", icon: <LayoutDashboard size={18} />, title: "Dashboard" },
    { path: "/assessment", icon: <ListChecks size={18} />, title: "Assessment" },
    { path: "/regulations", icon: <FileText size={18} />, title: "Regulations" },
    { path: "/notifications", icon: <Bell size={18} />, title: "Notifications" },
    { path: "/calendar", icon: <Calendar size={18} />, title: "Calendar" },
    { path: "/profile", icon: <User size={18} />, title: "Profile" },
    { path: "/settings", icon: <Settings size={18} />, title: "Settings" }
  ];

  return (
    <div className="h-screen w-64 bg-white border-r flex flex-col">
      <div className="p-4 border-b flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-privacy-primary flex items-center justify-center text-white font-bold">
            PP
          </div>
          <span className="font-bold text-lg">PrivacyPulse</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-privacy-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              icon={item.icon}
              title={item.title}
              active={item.path === activePath}
            />
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <div className="font-medium text-sm">Demo User</div>
            <div className="text-xs text-muted-foreground">demo@example.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
