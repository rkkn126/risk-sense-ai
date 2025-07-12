import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AppHeader from "@/components/AppHeader";
import QueryForm from "@/components/QueryForm";
import TabNavigation from "@/components/TabNavigation";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import OverviewTab from "@/components/tabs/OverviewTab";
import EconomicTab from "@/components/tabs/EconomicTab";
import NewsTab from "@/components/tabs/NewsTab";
import AIInsightsTab from "@/components/tabs/AIInsightsTab";
import ClimateTab from "@/components/tabs/ClimateTab";
import P3Tab from "@/components/tabs/P3Tab";
import RiskRatingTab from "@/components/tabs/RiskRatingTab";
import RiskScenariosTab from "@/components/tabs/RiskScenariosTab";
import ReportGenerator from "@/components/ReportGenerator";
import AppFooter from "@/components/AppFooter";
import { getCountries, submitAnalysis } from "@/lib/api";
import { AnalysisRequest } from "@shared/schema";
import { AnalysisResult, CountryOption, TabType } from "@/lib/types";

export default function Home() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [analysisParams, setAnalysisParams] = useState<AnalysisRequest | null>(null);
  
  // Fetch countries for the dropdown
  const { 
    data: countries = [],
    isLoading: isCountriesLoading,
    error: countriesError
  } = useQuery({
    queryKey: ["/api/countries"],
    staleTime: Infinity, // Countries rarely change
  }) as { data: CountryOption[], isLoading: boolean, error: Error | null };

  // Handle analysis submission
  const {
    mutate: analyzeData,
    data: analysisResult,
    isPending: isAnalyzing,
    error: analysisError,
    reset: resetAnalysis
  } = useMutation({
    mutationFn: submitAnalysis,
    onSuccess: () => {
      toast({
        title: "Analysis completed",
        description: "Your analysis has been generated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to generate analysis. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Handle form submission
  const handleSubmitQuery = (data: AnalysisRequest) => {
    setAnalysisParams(data);
    analyzeData(data);
  };

  // Handle retry on error
  const handleRetry = () => {
    if (analysisParams) {
      analyzeData(analysisParams);
    } else {
      resetAnalysis();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QueryForm 
          onSubmit={handleSubmitQuery} 
          isLoading={isAnalyzing}
          countries={countries}
          isCountriesLoading={isCountriesLoading}
        />
        
        {!analysisResult && !isAnalyzing && !analysisError && (
          <div className="flex items-center justify-center mt-20 mb-20">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Risk Sense AI - Smart Investment Analysis</h2>
              <p className="text-gray-600 max-w-lg">
                Select a country and enter a topic or question above to get comprehensive investment insights based on multiple data sources.
              </p>
            </div>
          </div>
        )}
        
        {analysisResult && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <ReportGenerator data={analysisResult} activeTab={activeTab} />
          </div>
        )}
        
        <LoadingState 
          isVisible={isAnalyzing}
          selectedCountry={analysisParams?.countryCode ? countries.find(c => c.code === analysisParams.countryCode)?.name : ""}
        />
        
        <ErrorState 
          error={analysisError} 
          isVisible={!!analysisError}
          onRetry={handleRetry}
        />
        
        {analysisResult && !isAnalyzing && !analysisError && (
          <div>
            {activeTab === "overview" && (
              <div data-tab="overview">
                <OverviewTab data={analysisResult} />
              </div>
            )}
            
            {activeTab === "economic" && (
              <div data-tab="economic">
                <EconomicTab data={analysisResult} />
              </div>
            )}
            
            {activeTab === "news" && (
              <div data-tab="news">
                <NewsTab data={analysisResult} />
              </div>
            )}
            
            {activeTab === "ai" && (
              <div data-tab="ai">
                <AIInsightsTab data={analysisResult} />
              </div>
            )}
            
            {activeTab === "climate" && (
              <div data-tab="climate">
                <ClimateTab data={analysisResult} />
              </div>
            )}
            
            {activeTab === "p3" && (
              <div data-tab="p3">
                <P3Tab data={analysisResult} />
              </div>
            )}
            
            {activeTab === "risk" && (
              <div data-tab="risk">
                <RiskScenariosTab data={analysisResult} />
              </div>
            )}
            
            {activeTab === "riskrating" && (
              <div data-tab="riskrating">
                <RiskRatingTab />
              </div>
            )}
          </div>
        )}
      </main>
      
      <AppFooter />
    </div>
  );
}
