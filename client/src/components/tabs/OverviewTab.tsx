import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { AlertCircle, DollarSign, ExternalLink, Landmark, ShieldAlert, TrendingUp } from "lucide-react";
import { AnalysisResult, LineChartData, BarChartData } from "@/lib/types";
import { getGDPGrowthData, getUnemploymentData } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { getCreditRating, getRatingColor, getOutlookColor } from "@/lib/creditRatingsData";
import { getDisasterRisk, getRiskLevelText, getRiskColor } from "@/lib/disasterRiskData";
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OverviewTabProps {
  data: AnalysisResult;
}

export default function OverviewTab({ data }: OverviewTabProps) {
  const [gdpData, setGdpData] = useState<LineChartData | null>(null);
  const [gdpLoading, setGdpLoading] = useState(true);
  const [unemploymentData, setUnemploymentData] = useState<BarChartData | null>(null);
  const [unemploymentLoading, setUnemploymentLoading] = useState(true);

  useEffect(() => {
    // Fetch GDP growth data
    setGdpLoading(true);
    getGDPGrowthData(data.countryCode)
      .then(response => {
        setGdpData(response);
        setGdpLoading(false);
      })
      .catch(() => {
        setGdpLoading(false);
      });

    // Fetch unemployment data
    setUnemploymentLoading(true);
    getUnemploymentData(data.countryCode)
      .then(response => {
        setUnemploymentData(response);
        setUnemploymentLoading(false);
      })
      .catch(() => {
        setUnemploymentLoading(false);
      });
  }, [data.countryCode]);

  const { overview } = data;

  return (
    <>
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 w-1 h-8 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-800">Country Overview</h2>
          </div>
          <div className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-lg shadow-sm">
            <img
              src={`https://flagcdn.com/${data.countryCode.toLowerCase()}.svg`}
              alt={`${data.countryName} flag`}
              className="w-6 h-5 mr-3 border border-white/20 shadow-sm"
            />
            <span className="text-sm font-semibold text-white">{data.countryName}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* GDP Box */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="rounded-full bg-emerald-500 p-2 mr-3 shadow-sm">
                <DollarSign className="text-white h-5 w-5" />
              </div>
              <h3 className="font-medium text-emerald-800">GDP</h3>
            </div>
            <p className="text-3xl font-semibold text-emerald-800">{overview.gdp}</p>
            <p className="text-sm text-emerald-600 mt-1">{overview.gdpPerCapita} per capita</p>
          </div>
          
          {/* Credit Rating Box */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-500 p-2 mr-3 shadow-sm">
                  <TrendingUp className="text-white h-5 w-5" />
                </div>
                <h3 className="font-medium text-blue-800">Credit Rating</h3>
              </div>
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger>
                    <div className="flex items-center text-blue-500 text-xs hover:underline cursor-help">
                      <span>S&P Rating</span>
                      <AlertCircle className="h-3 w-3 ml-1" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      Standard & Poor's (S&P) credit ratings assess a country's ability to meet its financial obligations. 
                      AAA is the highest rating, indicating exceptional creditworthiness.
                    </p>
                    <a 
                      href="https://en.wikipedia.org/wiki/List_of_countries_by_credit_rating" 
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-500 flex items-center mt-1 hover:underline"
                    >
                      Source: Wikipedia <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            </div>
            
            {(() => {
              const creditRating = getCreditRating(data.countryCode);
              if (creditRating) {
                return (
                  <>
                    <p className={`text-3xl font-semibold ${getRatingColor(creditRating.rating)}`}>
                      {creditRating.rating}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className={`text-sm ${getOutlookColor(creditRating.outlook)}`}>
                        Outlook: {creditRating.outlook}
                      </p>
                      <p className="text-xs text-gray-500">
                        Updated: {creditRating.dateUpdated}
                      </p>
                    </div>
                  </>
                );
              } else {
                return (
                  <p className="text-lg text-gray-500">
                    No credit rating data available
                  </p>
                );
              }
            })()}
          </div>
          
          {/* Disaster Risk Box */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="rounded-full bg-amber-500 p-2 mr-3 shadow-sm">
                  <ShieldAlert className="text-white h-5 w-5" />
                </div>
                <h3 className="font-medium text-amber-800">Disaster Risk</h3>
              </div>
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger>
                    <div className="flex items-center text-amber-500 text-xs hover:underline cursor-help">
                      <span>WRI Rating</span>
                      <AlertCircle className="h-3 w-3 ml-1" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      The World Risk Index (WRI) measures a country's vulnerability to natural disasters, 
                      combining exposure to hazards and the societal capacity to cope.
                    </p>
                    <a 
                      href="https://en.wikipedia.org/wiki/List_of_countries_by_natural_disaster_risk" 
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-xs text-amber-500 flex items-center mt-1 hover:underline"
                    >
                      Source: Wikipedia <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            </div>
            
            {(() => {
              const disasterRisk = getDisasterRisk(data.countryCode);
              if (disasterRisk) {
                return (
                  <>
                    <p className={`text-3xl font-semibold ${getRiskColor(disasterRisk.wriRank)}`}>
                      {getRiskLevelText(disasterRisk.wriRank)}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-amber-700">
                        WRI Rank: {disasterRisk.wriRank} of 181
                      </p>
                      <p className="text-xs text-gray-500">
                        Score: {disasterRisk.wriScore?.toFixed(2)}
                      </p>
                    </div>
                  </>
                );
              } else {
                return (
                  <p className="text-lg text-gray-500">
                    No disaster risk data available
                  </p>
                );
              }
            })()}
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
            <h3 className="text-lg font-semibold text-gray-800">Analysis Summary</h3>
          </div>
          <div className="prose max-w-none bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
            {overview.summary.map((paragraph, index) => (
              <p key={index} className={`${index < overview.summary.length - 1 ? "mb-4" : ""} text-gray-700 leading-relaxed`}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 w-1 h-8 rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800">Key Indicators</h2>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-medium text-blue-800">GDP Growth Rate (2019-2023)</h3>
            <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Annual % Change</span>
          </div>
          <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-lg h-72 border border-blue-100 shadow-sm">
            {gdpLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            ) : gdpData ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gdpData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    activeDot={{ r: 8, fill: '#2563EB', stroke: 'white', strokeWidth: 2 }} 
                    dot={{ r: 4, fill: '#3B82F6', stroke: 'white', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <p>No GDP growth data available</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Data Sources Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-gray-600 to-gray-800 w-1 h-6 rounded-full mr-3"></div>
          <h2 className="text-lg font-semibold text-gray-800">Data Sources</h2>
        </div>
        
        <div className="prose max-w-none text-sm text-gray-600">
          <ul className="space-y-2">
            <li className="flex items-start">
              <ExternalLink className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Economic Data:</strong> World Bank Open Data - 
                <a 
                  href="https://data.worldbank.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  data.worldbank.org
                </a>
              </span>
            </li>
            <li className="flex items-start">
              <ExternalLink className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Credit Ratings:</strong> Standard & Poor's (S&P) Global Ratings via Wikipedia - 
                <a 
                  href="https://en.wikipedia.org/wiki/List_of_countries_by_credit_rating" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  List of countries by credit rating
                </a>
              </span>
            </li>
            <li className="flex items-start">
              <ExternalLink className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Natural Disaster Risk:</strong> World Risk Index (WRI) via Wikipedia - 
                <a 
                  href="https://en.wikipedia.org/wiki/List_of_countries_by_natural_disaster_risk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  List of countries by natural disaster risk
                </a>
              </span>
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            Data last updated: April 2024. Risk Sense AI compiles this information from multiple sources for analytical purposes only.
            This information should not be used as the sole basis for any investment or policy decisions.
          </p>
        </div>
      </section>
    </>
  );
}
