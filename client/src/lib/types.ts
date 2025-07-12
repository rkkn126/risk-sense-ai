import {
  Analysis,
  AnalysisRequest,
  EconomicIndicator,
  NewsItem,
  NewsSentiment,
  OverviewData,
  FollowUpQuestion
} from "@shared/schema";

// Project risk data types
export enum ProjectStatus {
  FUNDED = 'funded',
  ON_HOLD = 'on_hold',
  PROPOSED = 'proposed'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ProjectSector {
  ENERGY = 'energy',
  INFRASTRUCTURE = 'infrastructure',
  AGRICULTURE = 'agriculture',
  TECHNOLOGY = 'technology',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  WATER = 'water',
  FINANCE = 'finance'
}

export type Project = {
  id: string;
  name: string;
  description: string;
  country: string;
  status: ProjectStatus;
  sector: ProjectSector;
  budget: number; // in millions USD
  startDate: string;
  expectedEndDate: string;
  currentRisk: RiskLevel;
  previousRisk?: RiskLevel;
  riskFactors: string[];
  impactAnalysis: string;
};

// Country type for the dropdown
export type CountryOption = {
  code: string;
  name: string;
};

// Combined analysis result type
export type AnalysisResult = {
  countryCode: string;
  countryName: string;
  query: string;
  overview: OverviewData;
  economicData: {
    indicators: EconomicIndicator[];
    analysis: string[];
    comparison?: any; // Data for comparison chart
  };
  newsData: {
    items: NewsItem[];
    sentiment: NewsSentiment;
  };
  aiInsights: {
    content: string;
    followUpQuestions: FollowUpQuestion[];
  };
  projects?: Project[]; // Projects with risk analysis
};

// Tab types
export type TabType = 'overview' | 'economic' | 'news' | 'ai' | 'climate' | 'p3' | 'risk' | 'riskrating';

// Chart data types
export type ChartDataPoint = {
  name: string;
  value: number;
};

export type LineChartData = {
  name: string;
  value: number;
}[];

export type BarChartData = {
  name: string;
  value: number;
}[];

export type ComparativeChartData = {
  name: string;
  value: number;
  average: number;
}[];

// CDP Renewable Energy data types
export type CDPRenewableData = {
  hasData: boolean;
  message?: string;
  countryName?: string;
  citiesWithTargets?: number;
  cityList?: string[];
  totalTargets?: number;
  averageTargetYear?: number;
  averageRenewablePercentage?: number;
  targetTypes?: string[];
};
