// Sample data for companies with risk ratings
export interface CompanyRisk {
  id: string;
  name: string;
  country: string;
  sector: string;
  oldRating: 'AAA' | 'AA+' | 'AA' | 'AA-' | 'A+' | 'A' | 'A-' | 'BBB+' | 'BBB' | 'BBB-' | 'BB+' | 'BB' | 'BB-' | 'B+' | 'B' | 'B-' | 'CCC+' | 'CCC' | 'CCC-' | 'CC' | 'C' | 'D';
  aiRiskLevel: 'High' | 'Medium' | 'Low';
  riskFactors: string[];
}

// SNP rating downgrade logic
export const getAdjustedRating = (oldRating: string, riskLevel: 'High' | 'Medium' | 'Low'): string => {
  if (riskLevel !== 'High') {
    return oldRating; // No change for Medium or Low risk
  }

  // Downgrade by one step for high risk
  const ratings = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'BB-', 'B+', 'B', 'B-', 'CCC+', 'CCC', 'CCC-', 'CC', 'C', 'D'];
  const index = ratings.indexOf(oldRating);
  
  // If rating is found and not already at the lowest
  if (index !== -1 && index < ratings.length - 1) {
    return ratings[index + 1]; // Return next lower rating
  }
  
  // If rating is already at the lowest or not found
  return oldRating;
};

// Sample company risk data
export const companies: CompanyRisk[] = [
  {
    id: '1',
    name: 'TechGlobal Inc.',
    country: 'USA',
    sector: 'Technology',
    oldRating: 'AA',
    aiRiskLevel: 'High',
    riskFactors: ['Market volatility', 'Regulatory changes', 'Competitive pressure']
  },
  {
    id: '2',
    name: 'AgriFarm Ltd.',
    country: 'Australia',
    sector: 'Agriculture',
    oldRating: 'A+',
    aiRiskLevel: 'High',
    riskFactors: ['Climate impacts', 'Supply chain disruption', 'Water scarcity']
  },
  {
    id: '3',
    name: 'EcoEnergy GmbH',
    country: 'Germany',
    sector: 'Renewable Energy',
    oldRating: 'A',
    aiRiskLevel: 'Medium',
    riskFactors: ['Policy changes', 'Technology transitions']
  },
  {
    id: '4',
    name: 'MineFuture Corp.',
    country: 'Canada',
    sector: 'Mining',
    oldRating: 'BBB+',
    aiRiskLevel: 'High',
    riskFactors: ['Environmental regulations', 'Resource depletion', 'Political instability in operating regions']
  },
  {
    id: '5',
    name: 'OceanTrade Shipping',
    country: 'Singapore',
    sector: 'Transportation',
    oldRating: 'BBB',
    aiRiskLevel: 'Medium',
    riskFactors: ['Fuel price volatility', 'Maritime regulations']
  },
  {
    id: '6',
    name: 'PharmaCure Ltd.',
    country: 'UK',
    sector: 'Healthcare',
    oldRating: 'AA-',
    aiRiskLevel: 'Low',
    riskFactors: ['Patent expirations']
  },
  {
    id: '7',
    name: 'DigitalBank Holdings',
    country: 'Switzerland',
    sector: 'Financial Services',
    oldRating: 'A+',
    aiRiskLevel: 'Medium',
    riskFactors: ['Cybersecurity threats', 'Regulatory compliance']
  },
  {
    id: '8',
    name: 'AutoMotive International',
    country: 'Japan',
    sector: 'Automotive',
    oldRating: 'BBB-',
    aiRiskLevel: 'High',
    riskFactors: ['Supply chain disruptions', 'Electric vehicle transition', 'Trade tariffs']
  },
  {
    id: '9',
    name: 'RealEstate Developments',
    country: 'UAE',
    sector: 'Real Estate',
    oldRating: 'BB+',
    aiRiskLevel: 'High',
    riskFactors: ['Market bubble concerns', 'Rising interest rates', 'Regional instability']
  },
  {
    id: '10',
    name: 'GreenTech Solutions',
    country: 'Denmark',
    sector: 'CleanTech',
    oldRating: 'A-',
    aiRiskLevel: 'Low',
    riskFactors: ['Funding cycles']
  }
];