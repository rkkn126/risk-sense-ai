import { useState } from "react";
import { ChartPieIcon, LayoutDashboard, LibraryIcon } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export type NavigationPage = "risk-sense" | "nib-recommendations";

interface LeftNavigationProps {
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
}

export default function LeftNavigation({ activePage, setActivePage }: LeftNavigationProps) {
  const navigationItems = [
    {
      id: "risk-sense",
      label: "Risk Sense AI - Smart Investment Analysis",
      icon: <ChartPieIcon className="w-5 h-5" />
    },
    {
      id: "nib-recommendations",
      label: "Smart Recommendations - NIB",
      icon: <LibraryIcon className="w-5 h-5" />
    }
  ];

  return (
    <div className="bg-gray-50 border-r border-gray-200 w-64 min-h-screen flex-shrink-0">
      <div className="p-4">
        <h2 className="font-bold text-lg text-gray-800 mb-4">Navigation</h2>
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as NavigationPage)}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-left rounded-lg transition-colors",
                activePage === item.id
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}