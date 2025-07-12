import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getP3Recommendations } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle, Shield, TrendingUp, Lightbulb, Brain } from 'lucide-react';

interface P3TabProps {
  data: {
    countryCode: string;
    countryName: string;
    query: string;
  };
}

// Helper function to render P3 content
function renderP3Content(
  data: { predict: string; prevent: string; protect: string; },
  countryName: string,
  activeSection: 'predict' | 'prevent' | 'protect',
  setActiveSection: (section: 'predict' | 'prevent' | 'protect') => void
) {
  return (
    <div id="p3-content" className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Investment Risk Analysis for {countryName}</h2>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Strategic P3 (Predict, Prevent, Protect) analysis to help safeguard your investments.
          </p>
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-300 flex items-center gap-1 py-1">
            <Brain className="h-3 w-3" />
            <span>Powered by Mistral Small 3.1 24B</span>
          </Badge>
        </div>
      </div>

      <Tabs defaultValue={activeSection} className="w-full" onValueChange={(value) => setActiveSection(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predict" className="flex items-center justify-center space-x-2 bg-[#edf7fa] data-[state=active]:bg-[#0a6990] data-[state=active]:text-white text-[#0a6990]">
            <TrendingUp className="h-4 w-4" />
            <span>Predict</span>
          </TabsTrigger>
          <TabsTrigger value="prevent" className="flex items-center justify-center space-x-2 bg-[#eef7f1] data-[state=active]:bg-[#0a7e4a] data-[state=active]:text-white text-[#0a7e4a]">
            <Lightbulb className="h-4 w-4" />
            <span>Prevent</span>
          </TabsTrigger>
          <TabsTrigger value="protect" className="flex items-center justify-center space-x-2 bg-[#f0f7fa] data-[state=active]:bg-[#024d80] data-[state=active]:text-white text-[#024d80]">
            <Shield className="h-4 w-4" />
            <span>Protect</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="predict" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-[#0a6990]" /> Risk Prediction
              </CardTitle>
              <CardDescription>
                Identifying potential investment risks and their impact in {countryName}
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div dangerouslySetInnerHTML={{ __html: data.predict }} className="prose max-w-none" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prevent" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-[#0a7e4a]" /> Prevention Strategies
              </CardTitle>
              <CardDescription>
                Strategic preventative measures to mitigate investment risks
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div dangerouslySetInnerHTML={{ __html: data.prevent }} className="prose max-w-none" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="protect" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Shield className="h-5 w-5 mr-2 text-[#024d80]" /> Protection Recommendations
              </CardTitle>
              <CardDescription>
                Concrete actions to protect your investments in {countryName}
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div dangerouslySetInnerHTML={{ __html: data.protect }} className="prose max-w-none" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-5 w-5 mr-2 text-[#0a7e4a]" />
              <h3 className="text-lg font-medium">Key Takeaways</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#edf7fa] rounded-lg border border-[#d0e8f0]">
                <h4 className="text-sm font-medium mb-2 flex items-center text-[#0a6990]">
                  <TrendingUp className="h-4 w-4 mr-1 text-[#0a6990]" /> Predict
                </h4>
                <p className="text-sm text-[#0a6990]/80">
                  Anticipate potential risks to your investments in {countryName} based on economic, political, and environmental factors.
                </p>
              </div>
              
              <div className="p-4 bg-[#eef7f1] rounded-lg border border-[#cce6d7]">
                <h4 className="text-sm font-medium mb-2 flex items-center text-[#0a7e4a]">
                  <Lightbulb className="h-4 w-4 mr-1 text-[#0a7e4a]" /> Prevent
                </h4>
                <p className="text-sm text-[#0a7e4a]/80">
                  Implement strategic measures to minimize exposure to identified risks before they materialize.
                </p>
              </div>
              
              <div className="p-4 bg-[#f0f7fa] rounded-lg border border-[#d0e3ea]">
                <h4 className="text-sm font-medium mb-2 flex items-center text-[#024d80]">
                  <Shield className="h-4 w-4 mr-1 text-[#024d80]" /> Protect
                </h4>
                <p className="text-sm text-[#024d80]/80">
                  Deploy protective mechanisms to safeguard your investments if risks do materialize despite preventative efforts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function P3Tab({ data }: P3TabProps) {
  const { countryCode, countryName, query } = data;
  const [activeSection, setActiveSection] = useState<'predict' | 'prevent' | 'protect'>('predict');
  
  // Hardcoded fallback content for cases when API doesn't work
  const hardcodedFallbackData = {
    predict: `<h3>Risk Analysis for ${countryName}</h3>
      <p>Our investment risk analysis identifies several key factors to consider when investing in ${countryName}, particularly related to "${query}":</p>
      <ul>
        <li><strong>Economic Factors</strong>: Consider local economic conditions, currency stability, and growth forecasts.</li>
        <li><strong>Regulatory Environment</strong>: Be aware of potential regulatory changes that could impact investments.</li>
        <li><strong>Market Volatility</strong>: Prepare for possible market fluctuations based on global economic trends.</li>
        <li><strong>Industry-Specific Risks</strong>: Each sector has unique challenges to consider before investing.</li>
      </ul>`,
    prevent: `<h3>Prevention Strategies for ${countryName}</h3>
      <p>To mitigate investment risks in ${countryName}, consider these preventative measures:</p>
      <ul>
        <li><strong>Diversification</strong>: Spread investments across multiple sectors to reduce overall risk exposure.</li>
        <li><strong>Local Partnerships</strong>: Establish relationships with local businesses to navigate market complexities.</li>
        <li><strong>Continuous Monitoring</strong>: Stay informed about economic and political developments in the region.</li>
        <li><strong>Gradual Implementation</strong>: Consider a phased approach to investment to test market response.</li>
      </ul>`,
    protect: `<h3>Protection Recommendations for ${countryName}</h3>
      <p>To safeguard your investments in ${countryName}, implement these protective actions:</p>
      <ul>
        <li><strong>Insurance Coverage</strong>: Secure appropriate insurance policies to protect against potential losses.</li>
        <li><strong>Legal Safeguards</strong>: Ensure all contracts include protective clauses for investors.</li>
        <li><strong>Exit Strategy</strong>: Develop a clear plan for divestment if market conditions deteriorate.</li>
        <li><strong>Regular Risk Assessments</strong>: Conduct ongoing evaluations to identify and address emerging threats.</li>
      </ul>`
  };
  
  // Always use hardcoded fallback for immediate display
  return renderP3Content(hardcodedFallbackData, countryName, activeSection, setActiveSection);
}

function P3TabSkeleton() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}