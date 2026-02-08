import {
  BookOpen,
  Brain,
  LayoutDashboard,
  LogOut,
  Search,
  Upload,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/api/user";
import { useAppContext } from "@/lib/AppProvider";

const Sidebar = () => {
  const { setUser } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: Upload,
      label: "Ingest",
      path: "/upload",
    },
    {
      icon: Search,
      label: "Query",
      path: "/query",
    },
    {
      icon: BookOpen,
      label: "Library",
      path: "/library",
    },
  ];

  const { mutate: logout } = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => logoutUser(),
    onSuccess: (data) => {
      console.log(data);
      setUser(null);
      navigate("/auth/login");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <div className="w-[300px] border-r border-loom-border h-screen flex flex-col justify-between">
      <div className="p-5">
        <Link to={"/"} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-loom-surface border border-loom-gold/20 flex items-center justify-center shadow-[0_0_30px_rgba(212,168,83,0.1)]">
            <Brain className="w-6 h-6 text-loom-gold" />
          </div>
          <h1 className="text-2xl font-semibold text-loom-text tracking-tight">
            Loom
          </h1>
        </Link>
        <nav className="flex-1 px-4 py-6 space-y-2 mt-5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className="relative block">
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-loom-gold/10 rounded-lg border border-loom-gold/20"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <div
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "text-loom-gold" : "text-loom-muted hover:text-loom-text hover:bg-loom-surface"}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-loom-border">
        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-loom-surface/50 border border-loom-border">
          <div className="flex flex-col">
            <span className="text-xs text-loom-muted uppercase tracking-wider">
              Connected as
            </span>
            <span className="text-sm font-medium text-loom-text truncate max-w-[120px]">
              User
            </span>
          </div>
          <button
            className="text-loom-muted hover:text-loom-gold transition-colors p-2 cursor-pointer"
            title="Logout"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
