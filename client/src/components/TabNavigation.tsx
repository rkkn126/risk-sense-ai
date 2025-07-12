import { 
  LayoutDashboard, 
  LineChart, 
  Newspaper, 
  Brain,
  Leaf,
  Shield,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { TabType } from "@/lib/types";

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

// Function to get professional color styling for each tab
const getTabActiveStyles = (tabId: string): string => {
  switch (tabId) {
    case 'overview':
      return 'border-blue-600 text-blue-600 font-semibold';
    case 'economic':
      return 'border-emerald-600 text-emerald-600 font-semibold';
    case 'news':
      return 'border-amber-600 text-amber-600 font-semibold';
    case 'climate':
      return 'border-teal-600 text-teal-600 font-semibold';
    case 'ai':
      return 'border-purple-600 text-purple-600 font-semibold';
    case 'p3':
      return 'border-indigo-600 text-indigo-600 font-semibold';
    case 'risk':
      return 'border-red-600 text-red-600 font-semibold';
    case 'riskrating':
      return 'border-orange-600 text-orange-600 font-semibold';
    default:
      return 'border-primary text-primary font-semibold';
  }
};

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { id: 'economic', label: 'Economic Data', icon: <LineChart className="w-4 h-4 mr-2" /> },
    { id: 'news', label: 'News Analysis', icon: <Newspaper className="w-4 h-4 mr-2" /> },
    { id: 'climate', label: 'ESG Data', icon: <Leaf className="w-4 h-4 mr-2" /> },
    { id: 'ai', label: 'AI Insights', icon: <Brain className="w-4 h-4 mr-2" /> },
    { id: 'p3', label: 'P3 Strategy', icon: <Shield className="w-4 h-4 mr-2" /> },
    { id: 'risk', label: 'Risk Scenarios', icon: <AlertTriangle className="w-4 h-4 mr-2" /> },
    { id: 'riskrating', label: 'Risk Ratings', icon: <BarChart3 className="w-4 h-4 mr-2" /> }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? getTabActiveStyles(tab.id as string)
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id as TabType)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
