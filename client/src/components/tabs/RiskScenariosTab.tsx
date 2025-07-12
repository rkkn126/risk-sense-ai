import React, { useState, useEffect } from 'react';
import { AnalysisResult, Project, ProjectStatus, RiskLevel, ProjectSector } from '@/lib/types';
import { getProjectsWithRiskAnalysis } from '@/lib/api';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  Pause,
  Banknote,
  Activity
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

interface RiskScenariosTabProps {
  data: AnalysisResult;
}

export default function RiskScenariosTab({ data }: RiskScenariosTabProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Load project data when the component mounts
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getProjectsWithRiskAnalysis(data.countryCode)
      .then(projectData => {
        setProjects(projectData);
        if (projectData.length > 0) {
          setSelectedProject(projectData[0]);
        }
      })
      .catch(err => {
        console.error('Error fetching project data:', err);
        setError('Failed to load project risk data. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [data.countryCode]);

  // Helper function to get risk level color
  const getRiskLevelColor = (riskLevel: RiskLevel): string => {
    switch (riskLevel) {
      case RiskLevel.LOW:
        return 'bg-green-500';
      case RiskLevel.MEDIUM:
        return 'bg-amber-500';
      case RiskLevel.HIGH:
        return 'bg-red-500';
      case RiskLevel.CRITICAL:
        return 'bg-red-700';
      default:
        return 'bg-gray-500';
    }
  };

  // Helper function to get risk level badge
  const getRiskLevelBadge = (riskLevel: RiskLevel): JSX.Element => {
    switch (riskLevel) {
      case RiskLevel.LOW:
        return <Badge className="bg-green-500 hover:bg-green-600">Low Risk</Badge>;
      case RiskLevel.MEDIUM:
        return <Badge className="bg-amber-500 hover:bg-amber-600">Medium Risk</Badge>;
      case RiskLevel.HIGH:
        return <Badge className="bg-red-500 hover:bg-red-600">High Risk</Badge>;
      case RiskLevel.CRITICAL:
        return <Badge className="bg-red-700 hover:bg-red-800">Critical Risk</Badge>;
      default:
        return <Badge>Unknown Risk</Badge>;
    }
  };

  // Helper function to get project status badge
  const getStatusBadge = (status: ProjectStatus): JSX.Element => {
    switch (status) {
      case ProjectStatus.FUNDED:
        return <Badge className="bg-blue-500 hover:bg-blue-600">Funded</Badge>;
      case ProjectStatus.ON_HOLD:
        return <Badge className="bg-orange-500 hover:bg-orange-600">On Hold</Badge>;
      case ProjectStatus.PROPOSED:
        return <Badge className="bg-purple-500 hover:bg-purple-600">Proposed</Badge>;
      default:
        return <Badge>Unknown Status</Badge>;
    }
  };

  // Helper to get sector icon
  const getSectorIcon = (sector: ProjectSector): JSX.Element => {
    switch (sector) {
      case ProjectSector.ENERGY:
        return <div className="rounded-full bg-yellow-100 p-2"><Activity className="h-4 w-4 text-yellow-600" /></div>;
      case ProjectSector.INFRASTRUCTURE:
        return <div className="rounded-full bg-blue-100 p-2"><Activity className="h-4 w-4 text-blue-600" /></div>;
      case ProjectSector.AGRICULTURE:
        return <div className="rounded-full bg-green-100 p-2"><Activity className="h-4 w-4 text-green-600" /></div>;
      case ProjectSector.TECHNOLOGY:
        return <div className="rounded-full bg-indigo-100 p-2"><Activity className="h-4 w-4 text-indigo-600" /></div>;
      case ProjectSector.HEALTHCARE:
        return <div className="rounded-full bg-red-100 p-2"><Activity className="h-4 w-4 text-red-600" /></div>;
      case ProjectSector.EDUCATION:
        return <div className="rounded-full bg-amber-100 p-2"><Activity className="h-4 w-4 text-amber-600" /></div>;
      case ProjectSector.WATER:
        return <div className="rounded-full bg-cyan-100 p-2"><Activity className="h-4 w-4 text-cyan-600" /></div>;
      case ProjectSector.FINANCE:
        return <div className="rounded-full bg-emerald-100 p-2"><Activity className="h-4 w-4 text-emerald-600" /></div>;
      default:
        return <div className="rounded-full bg-gray-100 p-2"><Activity className="h-4 w-4 text-gray-600" /></div>;
    }
  };

  // Helper to get risk indicator
  const getRiskIndicator = (project: Project): JSX.Element => {
    if (!project.previousRisk) {
      return <span className="text-gray-500">—</span>;
    }
    
    if (getRiskValue(project.currentRisk) > getRiskValue(project.previousRisk)) {
      return <TrendingUp className="text-red-500 h-5 w-5" />;
    } else if (getRiskValue(project.currentRisk) < getRiskValue(project.previousRisk)) {
      return <TrendingDown className="text-green-500 h-5 w-5" />;
    } else {
      return <span className="text-gray-500">—</span>;
    }
  };

  // Helper to convert risk level to numeric value
  const getRiskValue = (risk: RiskLevel): number => {
    switch (risk) {
      case RiskLevel.LOW:
        return 1;
      case RiskLevel.MEDIUM:
        return 2;
      case RiskLevel.HIGH:
        return 3;
      case RiskLevel.CRITICAL:
        return 4;
      default:
        return 0;
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading project risk data for {data.countryName}...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="bg-red-50 text-red-800 p-6 rounded-lg shadow-sm max-w-2xl">
          <div className="flex items-center mb-3">
            <AlertCircle className="h-6 w-6 mr-2" />
            <h3 className="font-semibold">Error Loading Project Data</h3>
          </div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Render the projects table and details
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <div className="rounded-full bg-blue-100 p-2 mr-2">
                  <Banknote className="h-5 w-5 text-blue-600" />
                </div>
                Predictive Risk Scenarios
              </CardTitle>
              <CardDescription>
                Projects in {data.countryName} with AI-powered risk analysis based on economic indicators and news sentiment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="funded">
                <TabsList className="mb-4">
                  <TabsTrigger value="funded" className="bg-[#edf7fa] data-[state=active]:bg-[#0a6990] data-[state=active]:text-white text-[#0a6990]">Funded Projects</TabsTrigger>
                  <TabsTrigger value="onhold" className="bg-[#f7f0e8] data-[state=active]:bg-[#b86a00] data-[state=active]:text-white text-[#b86a00]">On Hold Projects</TabsTrigger>
                  <TabsTrigger value="all" className="bg-[#f0f7fa] data-[state=active]:bg-[#024d80] data-[state=active]:text-white text-[#024d80]">All Projects</TabsTrigger>
                </TabsList>
                
                <TabsContent value="funded">
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project Name</TableHead>
                          <TableHead>Sector</TableHead>
                          <TableHead>Budget ($M)</TableHead>
                          <TableHead>Risk Level</TableHead>
                          <TableHead>Trend</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects
                          .filter(p => p.status === ProjectStatus.FUNDED)
                          .map(project => (
                            <TableRow 
                              key={project.id} 
                              className={`cursor-pointer ${selectedProject?.id === project.id ? 'bg-blue-50' : ''}`}
                              onClick={() => setSelectedProject(project)}
                            >
                              <TableCell className="font-medium">{project.name}</TableCell>
                              <TableCell>{project.sector}</TableCell>
                              <TableCell>${project.budget.toFixed(1)}M</TableCell>
                              <TableCell>{getRiskLevelBadge(project.currentRisk)}</TableCell>
                              <TableCell>{getRiskIndicator(project)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="onhold">
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project Name</TableHead>
                          <TableHead>Sector</TableHead>
                          <TableHead>Budget ($M)</TableHead>
                          <TableHead>Risk Level</TableHead>
                          <TableHead>Trend</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects
                          .filter(p => p.status === ProjectStatus.ON_HOLD)
                          .map(project => (
                            <TableRow 
                              key={project.id} 
                              className={`cursor-pointer ${selectedProject?.id === project.id ? 'bg-blue-50' : ''}`}
                              onClick={() => setSelectedProject(project)}
                            >
                              <TableCell className="font-medium">{project.name}</TableCell>
                              <TableCell>{project.sector}</TableCell>
                              <TableCell>${project.budget.toFixed(1)}M</TableCell>
                              <TableCell>{getRiskLevelBadge(project.currentRisk)}</TableCell>
                              <TableCell>{getRiskIndicator(project)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="all">
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Sector</TableHead>
                          <TableHead>Budget ($M)</TableHead>
                          <TableHead>Risk Level</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map(project => (
                          <TableRow 
                            key={project.id} 
                            className={`cursor-pointer ${selectedProject?.id === project.id ? 'bg-blue-50' : ''}`}
                            onClick={() => setSelectedProject(project)}
                          >
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>{getStatusBadge(project.status)}</TableCell>
                            <TableCell>{project.sector}</TableCell>
                            <TableCell>${project.budget.toFixed(1)}M</TableCell>
                            <TableCell>{getRiskLevelBadge(project.currentRisk)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/3">
          {selectedProject ? (
            <Card>
              <CardHeader className="pb-2 space-y-4">
                <div className="flex justify-between items-start">
                  {getSectorIcon(selectedProject.sector)}
                  {getStatusBadge(selectedProject.status)}
                </div>
                <CardTitle className="font-bold">{selectedProject.name}</CardTitle>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Risk Level</span>
                    <div className="flex items-center gap-2">
                      {getRiskLevelBadge(selectedProject.currentRisk)}
                      {getRiskIndicator(selectedProject)}
                    </div>
                  </div>
                  <Progress 
                    value={getRiskValue(selectedProject.currentRisk) * 25} 
                    className={`h-2 ${getRiskLevelColor(selectedProject.currentRisk)}`} 
                  />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">{selectedProject.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Budget</p>
                    <p className="font-semibold">${selectedProject.budget.toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Timeline</p>
                    <p className="font-semibold">
                      {new Date(selectedProject.startDate).getFullYear()} - {new Date(selectedProject.expectedEndDate).getFullYear()}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Risk Factors</h4>
                  <ul className="space-y-1 text-sm">
                    {selectedProject.riskFactors.map((factor, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="ai-analysis">
                    <AccordionTrigger className="text-sm font-medium">AI Impact Analysis</AccordionTrigger>
                    <AccordionContent>
                      <div className="p-3 bg-blue-50 rounded-md text-sm">
                        {selectedProject.impactAnalysis}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="text-xs text-gray-500">ID: {selectedProject.id}</div>
                <div className="text-xs text-gray-500">
                  {selectedProject.status === ProjectStatus.FUNDED ? (
                    <div className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                      Active Project
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Pause className="h-3 w-3 text-orange-500 mr-1" />
                      Development Paused
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Clock className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                <p>Select a project to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Risk Rating Summary</CardTitle>
          <CardDescription>Projects by risk level in {data.countryName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                level: RiskLevel.LOW, 
                label: 'Low Risk', 
                color: 'bg-green-100 text-green-800',
                count: projects.filter(p => p.currentRisk === RiskLevel.LOW).length
              },
              { 
                level: RiskLevel.MEDIUM, 
                label: 'Medium Risk', 
                color: 'bg-amber-100 text-amber-800',
                count: projects.filter(p => p.currentRisk === RiskLevel.MEDIUM).length
              },
              { 
                level: RiskLevel.HIGH, 
                label: 'High Risk', 
                color: 'bg-red-100 text-red-800',
                count: projects.filter(p => p.currentRisk === RiskLevel.HIGH).length
              },
              { 
                level: RiskLevel.CRITICAL, 
                label: 'Critical Risk', 
                color: 'bg-red-900 text-white',
                count: projects.filter(p => p.currentRisk === RiskLevel.CRITICAL).length
              }
            ].map((item) => (
              <Card key={item.level} className={`${item.color} border-0`}>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">{item.count}</p>
                  <p className="text-sm">{item.label} Projects</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}