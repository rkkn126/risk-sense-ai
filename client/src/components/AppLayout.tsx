import { ReactNode } from "react";
import { useLocation } from "wouter";
import LeftNavigation, { NavigationPage } from "./LeftNavigation";
import Home from "@/pages/Home";
import NIBRecommendations from "@/pages/NIBRecommendations";

interface AppLayoutProps {
  params?: Record<string, string>;
  children?: ReactNode;
  activePage?: NavigationPage;
}

export default function AppLayout({ activePage: propActivePage, params, ...props }: AppLayoutProps) {
  const [location, setLocation] = useLocation();
  
  // Use the prop if provided, otherwise determine from the URL
  const activePage = propActivePage || (location === "/nib" ? "nib-recommendations" : "risk-sense");
  
  // Handle navigation changes with URL updates
  const handlePageChange = (page: NavigationPage) => {
    if (page === "nib-recommendations") {
      setLocation("/nib");
    } else {
      setLocation("/");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <LeftNavigation activePage={activePage} setActivePage={handlePageChange} />
      
      <div className="flex-1 overflow-auto">
        {activePage === "risk-sense" && <Home />}
        {activePage === "nib-recommendations" && <NIBRecommendations />}
      </div>
    </div>
  );
}