import { useState } from "react";
import { 
  AlertTriangle, 
  TrendingDown, 
  ShieldAlert, 
  Info,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from "@/components/ui/table";
import { companies, getAdjustedRating } from "@/lib/sampleRiskData";

export default function RiskRatingTab() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get risk badge styling
  const getRiskBadgeStyle = (riskLevel: 'High' | 'Medium' | 'Low') => {
    switch(riskLevel) {
      case 'High':
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case 'Medium':
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case 'Low':
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "";
    }
  };

  // Get rating change display
  const getRatingChange = (oldRating: string, riskLevel: 'High' | 'Medium' | 'Low') => {
    const newRating = getAdjustedRating(oldRating, riskLevel);
    
    if (oldRating === newRating) {
      return (
        <div className="flex items-center">
          <span className="font-medium">{newRating}</span>
          {riskLevel === 'Medium' && (
            <span className="text-amber-500 ml-2 text-sm">
              (Watch)
            </span>
          )}
        </div>
      );
    }
    
    return (
      <div className="flex flex-col">
        <div className="flex items-center text-red-600">
          <span className="font-medium">{newRating}</span>
          <TrendingDown className="h-4 w-4 ml-1" />
        </div>
        <div className="text-sm text-gray-500 line-through">{oldRating}</div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent">
            AI-Adjusted Risk Ratings
          </h2>
          <p className="text-gray-600 mt-1">
            Company risk ratings adjusted based on AI analysis of current market conditions
          </p>
        </div>
        <div className="flex items-center relative">
          <Input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">About Risk Adjustments</h3>
            <p className="text-sm text-blue-700 mt-1">
              Companies with high AI-detected risk factors have their ratings adjusted down one notch 
              from their traditional SNP rating. Medium risk companies are placed on watch, while 
              low risk companies maintain their original ratings.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>AI Risk Level</TableHead>
              <TableHead>Adjusted Rating</TableHead>
              <TableHead>Risk Factors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.country}</TableCell>
                  <TableCell>{company.sector}</TableCell>
                  <TableCell>
                    <Badge className={getRiskBadgeStyle(company.aiRiskLevel)}>
                      {company.aiRiskLevel}
                      {company.aiRiskLevel === 'High' && <AlertTriangle className="ml-1 h-3 w-3" />}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getRatingChange(company.oldRating, company.aiRiskLevel)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {company.riskFactors.map((factor, index) => (
                        <Badge variant="outline" key={index} className="text-xs">
                          <ShieldAlert className="h-3 w-3 mr-1" />
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No companies found matching your search criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}