import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Leaf, Calendar, BatteryCharging, Building2, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getCDPRenewableData } from "@/lib/api";
import { AnalysisResult, CDPRenewableData } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ClimateTabProps {
  data: AnalysisResult;
}

export default function ClimateTab({ data }: ClimateTabProps) {
  const [selectedTab, setSelectedTab] = useState<'renewable' | 'emissions'>('renewable');

  // Fetch CDP renewable energy data
  const { data: cdpData, isLoading, error } = useQuery({
    queryKey: ['/api/cdp/renewable', data.countryCode],
    queryFn: () => getCDPRenewableData(data.countryCode),
  });

  // For future integration - this could show emissions data
  const handleTabChange = (tab: 'renewable' | 'emissions') => {
    setSelectedTab(tab);
  };

  if (isLoading) {
    return <ClimateTabSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Unable to load climate data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!cdpData.hasData) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Climate Data</AlertTitle>
        <AlertDescription>
          {cdpData.message || "No renewable energy targets found for this country in the CDP database."}
        </AlertDescription>
      </Alert>
    );
  }

  // Create chart data from the CDP data
  const chartData = [
    {
      name: "Renewable Target %",
      value: cdpData.averageRenewablePercentage || 0
    },
    {
      name: "Remaining %",
      value: 100 - (cdpData.averageRenewablePercentage || 0)
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-500" /> 
                Renewable Energy Targets
              </CardTitle>
              <Badge className="bg-green-600">{cdpData.countryName}</Badge>
            </div>
            <CardDescription>
              Data from Carbon Disclosure Project (CDP)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Renewable Target</span>
                <span className="font-bold text-xl text-green-600">{cdpData.averageRenewablePercentage || 0}%</span>
              </div>
              <Progress value={cdpData.averageRenewablePercentage || 0} className="h-2" />
              
              <div className="mt-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Average target year: {cdpData.averageTargetYear || "N/A"}
                </span>
              </div>
              
              <div className="mt-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Cities with targets: {cdpData.citiesWithTargets || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BatteryCharging className="h-5 w-5 text-green-500" />
              Renewable Energy Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#059669" : "#d1d5db"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">City Renewable Energy Targets</CardTitle>
          <CardDescription>
            Cities in {cdpData.countryName} with renewable energy targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {cdpData.cityList?.map((city: string, index: number) => (
              <Badge key={index} variant="outline" className="px-3 py-1 text-sm">
                {city}
              </Badge>
            ))}
            {!cdpData.cityList?.length && <span className="text-muted-foreground">No city data available</span>}
          </div>
          
          <Separator className="my-4" />
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Target Types</h4>
            <div className="flex flex-col gap-2">
              {cdpData.targetTypes?.map((type: string, index: number) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Leaf className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>{type}</span>
                </div>
              ))}
              {!cdpData.targetTypes?.length && <span className="text-muted-foreground">No target type data available</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ClimateTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
              
              <div className="mt-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
          
          <Skeleton className="h-px w-full my-4" />
          
          <div className="mt-4">
            <Skeleton className="h-5 w-32 mb-3" />
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-4 w-full mb-2" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}