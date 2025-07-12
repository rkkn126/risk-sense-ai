import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, CheckCircle, Database, ExternalLink, Globe, LineChart, Shield, TrendingUp, Zap } from "lucide-react";
import { getNIBRecommendations } from "@/lib/api";

export default function NIBRecommendations() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [nibData, setNibData] = useState<any>(null);
  const [aiRecommendations, setAIRecommendations] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [analysisDate, setAnalysisDate] = useState<string>("");

  useEffect(() => {
    // Fetch NIB data and AI-powered recommendations
    const fetchNIBData = async () => {
      try {
        setIsLoading(true);
        
        // Use the AI-powered API to get recommendations
        const response = await getNIBRecommendations();
        
        console.log("NIB AI Recommendations:", response);
        
        // Extract basic NIB data
        setNibData(response.basic);
        
        // Extract AI-generated recommendations
        setAIRecommendations(response.aiRecommendations);
        
        // Set the timestamp when analysis was performed
        setAnalysisDate(new Date(response.analysisDate).toLocaleDateString());
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching NIB data:", err);
        setError(err as Error);
        setIsLoading(false);
        toast({
          title: "Error loading NIB data",
          description: "Failed to load data from NIB. Please try again later.",
          variant: "destructive"
        });
      }
    };

    // Call the function to fetch data
    fetchNIBData();
  }, [toast]);

  // Function to render the appropriate icon
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "finance":
        return <LineChart className="h-6 w-6 text-[#024d80]" />;
      case "sustainability":
        return <Shield className="h-6 w-6 text-[#0a7e4a]" />;
      case "globe":
        return <Globe className="h-6 w-6 text-[#0a6990]" />;
      case "projects":
        return <Database className="h-6 w-6 text-[#035d99]" />;
      default:
        return <BookOpen className="h-6 w-6 text-[#035d99]" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 w-full rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">
              We encountered an error while loading the NIB data. Please try again later.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-[#024d80] to-[#0a7e4a] bg-clip-text text-transparent">
            Smart Recommendations - Nordic Investment Bank
          </h1>
          <p className="text-lg text-gray-600 mb-1">
            Key insights and recommendations based on NIB's annual report and strategy
          </p>
          <p className="text-sm text-gray-500 flex items-center">
            <span className="mr-1">Source information from</span>
            <a 
              href="https://www.nib.int/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#024d80] inline-flex items-center hover:underline"
            >
              www.nib.int
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
            <span className="mx-1">and</span>
            <a 
              href="https://www.nib.int/who-we-are/our-year-in-brief" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#024d80] inline-flex items-center hover:underline"
            >
              NIB Year in Brief
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {nibData?.yearInBrief?.keyHighlights.map((highlight: any, index: number) => (
            <Card key={index} className="border-t-4 border-[#024d80]">
              <CardHeader>
                <CardTitle className="text-xl">{highlight.title}</CardTitle>
                <CardDescription className="text-[#035d99] font-semibold text-lg">
                  {highlight.value}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{highlight.description}</p>
                <a 
                  href={highlight.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#024d80] text-xs flex items-center mt-2 hover:underline"
                >
                  Source: NIB.int
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Strategic Focus Areas</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="prose max-w-none">
              <p className="mb-4">
                The Nordic Investment Bank (NIB) is an international financial institution owned by the Nordic and Baltic countries. NIB works to improve the productivity and environment of the Nordic and Baltic countries by providing financing for projects that support these objectives.
              </p>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-gray-800">NIB's Mandate:</h3>
                <a 
                  href="https://www.nib.int/who-we-are/about" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#024d80] text-sm flex items-center hover:underline"
                >
                  Source: NIB.int - About
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#0a7e4a] mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Productivity:</strong> NIB finances projects that contribute to productivity growth in the Nordic and Baltic countries. This includes technical progress and innovation, development of human capital, improvements in infrastructure, and market efficiency.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#0a7e4a] mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Environment:</strong> NIB provides financing for projects that lead to improved resource efficiency, development of a competitive low carbon economy, protection of the environment and its ecosystem services, and development of clean technology.</span>
                </li>
              </ul>
              <p className="mt-4 text-gray-700">
                All projects financed by NIB are assessed for their potential impact on productivity and the environment. NIB's lending activities are guided by these two pillars of their mandate.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex flex-col mb-4">
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                Investment Recommendations
                {analysisDate && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    Analysis performed on: {analysisDate}
                  </span>
                )}
              </h2>
            </div>
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
              <p className="flex items-center">
                <Zap className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                <span>
                  <strong>AI-Generated Content:</strong> These investment recommendations are generated using the Mistral AI model (mistralai/mistral-small-3.1-24b-instruct) via OpenRouter API. The analysis is based on Nordic Investment Bank reports and market trends. Recommendations should be used for informational purposes only and not as financial advice.
                </span>
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="sustainable">
            <TabsList className="mb-6">
              <TabsTrigger value="sustainable">Sustainable Finance</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              <TabsTrigger value="innovation">Innovation & Growth</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sustainable" className="space-y-4">
              {aiRecommendations?.sustainable ? (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{aiRecommendations.sustainable.title}</CardTitle>
                        <CardDescription>{aiRecommendations.sustainable.description}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={aiRecommendations.sustainable.riskLevel === "Low" ? "outline" : 
                               aiRecommendations.sustainable.riskLevel === "Medium" ? "secondary" : "destructive"} 
                               className="text-xs">
                          Risk: {aiRecommendations.sustainable.riskLevel}
                        </Badge>
                        <Badge variant={aiRecommendations.sustainable.opportunityLevel === "High" ? "default" : "outline"} 
                               className="text-xs">
                          Opportunity: {aiRecommendations.sustainable.opportunityLevel}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">Industry: {aiRecommendations.sustainable.industry}</p>
                    <p className="mb-4">
                      {aiRecommendations.sustainable.analysis}
                    </p>
                    <div className="bg-[#edf7fa] p-4 rounded-md border border-[#d0e8f0]">
                      <h4 className="font-medium text-[#024d80] mb-2">AI Recommendation:</h4>
                      <p className="text-[#035d99]">
                        {aiRecommendations.sustainable.keyRecommendation}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-gray-500 italic w-full">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      AI-generated recommendation based on analysis of NIB reports and market trends
                    </p>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Green Bonds & Sustainable Finance</CardTitle>
                    <CardDescription>Opportunities in climate-focused investments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Based on NIB's focus on environmental sustainability, there are significant opportunities in green bonds and climate-focused investments. NIB's environmental bond issuance indicates strong market demand for sustainable finance products.
                    </p>
                    <div className="bg-[#edf7fa] p-4 rounded-md border border-[#d0e8f0]">
                      <h4 className="font-medium text-[#024d80] mb-2">Key Recommendation:</h4>
                      <p className="text-[#035d99]">
                        Consider investments in green bonds and sustainable finance instruments to capitalize on the growing market for environmentally friendly financial products.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="infrastructure" className="space-y-4">
              {aiRecommendations?.infrastructure ? (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{aiRecommendations.infrastructure.title}</CardTitle>
                        <CardDescription>{aiRecommendations.infrastructure.description}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={aiRecommendations.infrastructure.riskLevel === "Low" ? "outline" : 
                               aiRecommendations.infrastructure.riskLevel === "Medium" ? "secondary" : "destructive"} 
                               className="text-xs">
                          Risk: {aiRecommendations.infrastructure.riskLevel}
                        </Badge>
                        <Badge variant={aiRecommendations.infrastructure.opportunityLevel === "High" ? "default" : "outline"} 
                               className="text-xs">
                          Opportunity: {aiRecommendations.infrastructure.opportunityLevel}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">Industry: {aiRecommendations.infrastructure.industry}</p>
                    <p className="mb-4">
                      {aiRecommendations.infrastructure.analysis}
                    </p>
                    <div className="bg-[#eef7f1] p-4 rounded-md border border-[#cce6d7]">
                      <h4 className="font-medium text-[#0a6b40] mb-2">AI Recommendation:</h4>
                      <p className="text-[#0a7e4a]">
                        {aiRecommendations.infrastructure.keyRecommendation}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-gray-500 italic w-full">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      AI-generated recommendation based on analysis of NIB reports and market trends
                    </p>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Infrastructure Development</CardTitle>
                    <CardDescription>Critical infrastructure investment opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      NIB places significant emphasis on infrastructure development that enhances connectivity, efficiency, and sustainability across Nordic and Baltic regions. These projects often have long-term stable returns.
                    </p>
                    <div className="bg-[#eef7f1] p-4 rounded-md border border-[#cce6d7]">
                      <h4 className="font-medium text-[#0a6b40] mb-2">Key Recommendation:</h4>
                      <p className="text-[#0a7e4a]">
                        Infrastructure projects in renewable energy, transportation, and digital connectivity offer promising investment opportunities with both economic and environmental benefits.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="innovation" className="space-y-4">
              {aiRecommendations?.innovation ? (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{aiRecommendations.innovation.title}</CardTitle>
                        <CardDescription>{aiRecommendations.innovation.description}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={aiRecommendations.innovation.riskLevel === "Low" ? "outline" : 
                               aiRecommendations.innovation.riskLevel === "Medium" ? "secondary" : "destructive"} 
                               className="text-xs">
                          Risk: {aiRecommendations.innovation.riskLevel}
                        </Badge>
                        <Badge variant={aiRecommendations.innovation.opportunityLevel === "High" ? "default" : "outline"} 
                               className="text-xs">
                          Opportunity: {aiRecommendations.innovation.opportunityLevel}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">Industry: {aiRecommendations.innovation.industry}</p>
                    <p className="mb-4">
                      {aiRecommendations.innovation.analysis}
                    </p>
                    <div className="bg-[#f0f7fa] p-4 rounded-md border border-[#d0e3ea]">
                      <h4 className="font-medium text-[#0a5b7a] mb-2">AI Recommendation:</h4>
                      <p className="text-[#0a6990]">
                        {aiRecommendations.innovation.keyRecommendation}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-gray-500 italic w-full">
                      <Zap className="inline h-3 w-3 mr-1" />
                      AI-generated recommendation based on analysis of NIB reports and market trends
                    </p>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Innovation & Technology</CardTitle>
                    <CardDescription>Growth opportunities in Nordic-Baltic innovation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      The Nordic-Baltic region is known for its innovation capabilities. NIB's support for productivity growth through technical progress highlights the importance of this sector for long-term economic development.
                    </p>
                    <div className="bg-[#f0f7fa] p-4 rounded-md border border-[#d0e3ea]">
                      <h4 className="font-medium text-[#0a5b7a] mb-2">Key Recommendation:</h4>
                      <p className="text-[#0a6990]">
                        Consider investments in Nordic-Baltic technology companies and innovation initiatives, particularly those focused on digital transformation, clean technology, and bioeconomy.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Important Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nibData?.yearInBrief?.factSheets.map((sheet: any, index: number) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{sheet.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{sheet.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="text-[#024d80]" asChild>
                    <a href={sheet.link} target="_blank" rel="noopener noreferrer">
                      View Resource <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {nibData?.quickLinks.map((link: any, index: number) => (
              <a
                key={index}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center"
              >
                {renderIcon(link.icon)}
                <h3 className="font-medium text-gray-900 mt-2">{link.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{link.description}</p>
              </a>
            ))}
          </div>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
}