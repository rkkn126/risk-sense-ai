import { BarChart3 } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <BarChart3 className="text-primary w-6 h-6 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Risk Sense AI</span>
              <span className="text-lg ml-2 font-medium">Smart Investment Analysis</span>
            </h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/" className="text-gray-600 hover:text-primary">Home</a></li>
              <li><a href="/#about" className="text-gray-600 hover:text-primary">About</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
