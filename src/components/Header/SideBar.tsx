import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutUserAction } from "@/slice/authSlice";
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  Menu,
  Radio,
  User2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import NavBar from "./NavBar";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const location = useLocation();

  const { isAuthenticated, user } = useSelector(
    (state: {
      auth: {
        isAuthenticated: boolean;
        isLoading: boolean;
        user: { username: string };
      };
    }) => state.auth
  );

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUserAction());
  };

  const navLinks = [
    {
      to: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
    },
    ...(isAuthenticated
      ? [
          {
            to: "/analytics",
            label: "Analytics",
            icon: <BarChart3 className="w-5 h-5 mr-3" />,
          },
          {
            to: "/live",
            label: "Go Live",
            icon: <Radio className="w-5 h-5 mr-3" />,
          },
          {
            to: "/schedule",
            label: "Schedule",
            icon: <Calendar className="w-5 h-5 mr-3" />,
          },
        ]
      : []),
    {
      to: isAuthenticated ? `/profile/${user?.username}` : "/login",
      label: isAuthenticated ? "Profile" : "Login",
      icon: <User2 className="w-5 h-5 mr-3" />,
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 shadow-md transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full py-3 px-4">
          <nav className="space-y-2 ">
            <NavBar />
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <Link
                  to={link.to}
                  key={link.to}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 hover:bg-primary/10 dark:text-gray-400 dark:hover:bg-primary/10"
                  )}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer (optional) */}
          <div className="mt-auto text-sm text-center text-gray-400 dark:text-gray-600 pt-6">
            © 2025 DevMatch
          </div>
          <Button
            onClick={handleLogout}
            className="w-full rounded-full bg-red-500 text-white hover:bg-red-900 mt-3"
          >
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
