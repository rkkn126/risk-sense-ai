import { CountryOption } from './types';

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

// Sample project data for various countries
export const sampleProjects: Record<string, Project[]> = {
  // Australia
  AUS: [
    {
      id: 'aus-001',
      name: 'Sydney Renewable Energy Grid Upgrade',
      description: 'Modernizing Sydney\'s energy grid with renewable energy integration capabilities',
      country: 'AUS',
      status: ProjectStatus.FUNDED,
      sector: ProjectSector.ENERGY,
      budget: 230.5,
      startDate: '2023-06-15',
      expectedEndDate: '2026-12-31',
      currentRisk: RiskLevel.LOW,
      riskFactors: [
        'Policy changes in renewable energy subsidies',
        'Supply chain delays for specialized equipment'
      ],
      impactAnalysis: 'Project remains low risk due to strong government commitment to renewable energy targets and stable economic indicators.'
    },
    {
      id: 'aus-002',
      name: 'Murray-Darling Basin Sustainable Irrigation',
      description: 'Water conservation and sustainable farming practices in Australia\'s largest agricultural region',
      country: 'AUS',
      status: ProjectStatus.FUNDED,
      sector: ProjectSector.AGRICULTURE,
      budget: 185.3,
      startDate: '2023-03-01',
      expectedEndDate: '2027-02-28',
      currentRisk: RiskLevel.MEDIUM,
      previousRisk: RiskLevel.LOW,
      riskFactors: [
        'Climate change impacts on rainfall patterns',
        'Agricultural policy reforms under consideration',
        'Environmental activism concerns about water usage'
      ],
      impactAnalysis: 'Risk elevated due to recent drought forecasts and environmental policy debates. Budget contingencies might be needed.'
    },
    {
      id: 'aus-003',
      name: 'Melbourne-Brisbane High-Speed Rail Link',
      description: 'Fast rail connection between major eastern Australian cities',
      country: 'AUS',
      status: ProjectStatus.ON_HOLD,
      sector: ProjectSector.INFRASTRUCTURE,
      budget: 842.7,
      startDate: '2025-01-15',
      expectedEndDate: '2032-12-31',
      currentRisk: RiskLevel.HIGH,
      riskFactors: [
        'Inflation impact on construction costs',
        'Land acquisition challenges',
        'Political disagreements on funding structures',
        'Alternative transport technologies emerging'
      ],
      impactAnalysis: 'Project faces significant challenges due to rising inflation affecting budget projections. Political will has weakened as regional governance issues remain unresolved.'
    },
    {
      id: 'aus-004',
      name: 'Great Barrier Reef Conservation Technology',
      description: 'Advanced monitoring and conservation technologies to protect coral ecosystems',
      country: 'AUS',
      status: ProjectStatus.ON_HOLD,
      sector: ProjectSector.TECHNOLOGY,
      budget: 97.2,
      startDate: '2024-07-01',
      expectedEndDate: '2027-06-30',
      currentRisk: RiskLevel.MEDIUM,
      riskFactors: [
        'Research results uncertainty',
        'Competing priorities in environmental funding',
        'International cooperation complexities'
      ],
      impactAnalysis: 'While environmentally crucial, funding allocation delays have created uncertainty. Recent positive climate agreements may revitalize the project.'
    }
  ],
  
  // India
  IND: [
    {
      id: 'ind-001',
      name: 'Ganges River Clean-up Initiative',
      description: 'Comprehensive program to reduce pollution and restore the Ganges river ecosystem',
      country: 'IND',
      status: ProjectStatus.FUNDED,
      sector: ProjectSector.WATER,
      budget: 380.0,
      startDate: '2022-11-01',
      expectedEndDate: '2028-10-31',
      currentRisk: RiskLevel.MEDIUM,
      riskFactors: [
        'Coordination challenges across multiple states',
        'Industrial compliance issues',
        'Population growth pressures'
      ],
      impactAnalysis: 'Project progressing with moderate challenges. Recent strengthening of environmental regulations is positive but implementation remains complex.'
    },
    {
      id: 'ind-002',
      name: 'National Solar Power Development Corridor',
      description: 'Large-scale solar infrastructure in high-insolation regions of western and southern India',
      country: 'IND',
      status: ProjectStatus.FUNDED,
      sector: ProjectSector.ENERGY,
      budget: 510.2,
      startDate: '2023-02-15',
      expectedEndDate: '2027-12-31',
      currentRisk: RiskLevel.LOW,
      previousRisk: RiskLevel.MEDIUM,
      riskFactors: [
        'Land acquisition challenges',
        'Grid integration technical issues'
      ],
      impactAnalysis: 'Risk profile improved due to streamlined land acquisition policies and strong foreign investment interest. On track to exceed capacity targets.'
    },
    {
      id: 'ind-003',
      name: 'Rural Healthcare Digitalization',
      description: 'Digital health infrastructure for remote and underserved communities',
      country: 'IND',
      status: ProjectStatus.ON_HOLD,
      sector: ProjectSector.HEALTHCARE,
      budget: 215.8,
      startDate: '2024-05-01',
      expectedEndDate: '2028-04-30',
      currentRisk: RiskLevel.HIGH,
      riskFactors: [
        'Digital literacy challenges',
        'Infrastructure limitations in remote areas',
        'Healthcare workforce availability',
        'Data privacy regulatory uncertainty'
      ],
      impactAnalysis: 'Project faces significant hurdles due to infrastructure gaps that exceed initial assessments. Policymaker focus has shifted to other healthcare priorities.'
    }
  ],
  
  // United States
  USA: [
    {
      id: 'usa-001',
      name: 'Northeast Grid Resilience Enhancement',
      description: 'Strengthening energy infrastructure against extreme weather events in northeastern states',
      country: 'USA',
      status: ProjectStatus.FUNDED,
      sector: ProjectSector.INFRASTRUCTURE,
      budget: 420.3,
      startDate: '2023-04-01',
      expectedEndDate: '2026-03-31',
      currentRisk: RiskLevel.MEDIUM,
      riskFactors: [
        'Regulatory approval timelines',
        'Supply chain constraints for critical components',
        'Skilled labor shortages'
      ],
      impactAnalysis: 'Project maintaining moderate risk profile with some schedule pressures. Recent infrastructure legislation provides funding certainty.'
    },
    {
      id: 'usa-002',
      name: 'Western States Drought Resilience Program',
      description: 'Water conservation infrastructure and management systems for drought-prone regions',
      country: 'USA',
      status: ProjectStatus.FUNDED,
      sector: ProjectSector.WATER,
      budget: 367.9,
      startDate: '2022-10-15',
      expectedEndDate: '2027-09-30',
      currentRisk: RiskLevel.HIGH,
      previousRisk: RiskLevel.MEDIUM,
      riskFactors: [
        'Worsening climate change impacts',
        'Interstate water rights disputes',
        'Legal challenges from stakeholders',
        'Political shifts affecting environmental policies'
      ],
      impactAnalysis: 'Risk elevated due to accelerating drought conditions and interstate legal challenges. Project scope may require significant revision.'
    },
    {
      id: 'usa-003',
      name: 'Advanced Manufacturing Innovation Network',
      description: 'Modernizing manufacturing capabilities across multiple industries with advanced technologies',
      country: 'USA',
      status: ProjectStatus.ON_HOLD,
      sector: ProjectSector.TECHNOLOGY,
      budget: 290.6,
      startDate: '2024-01-01',
      expectedEndDate: '2027-12-31',
      currentRisk: RiskLevel.CRITICAL,
      previousRisk: RiskLevel.HIGH,
      riskFactors: [
        'Macroeconomic recession indicators',
        'Global trade tensions affecting supply chains',
        'Technology patent disputes',
        'Workforce adaptation challenges',
        'Competing national priorities'
      ],
      impactAnalysis: 'Project critically endangered by deteriorating economic conditions and shifting political priorities. Full reassessment recommended before proceeding.'
    }
  ],
  
  // Default projects for any country without specific data
  DEFAULT: [
    {
      id: 'default-001',
      name: 'Renewable Energy Development',
      description: 'Supporting renewable energy transition with grid modernization and new generation capacity',
      country: '',
      status: ProjectStatus.FUNDED,
      sector: ProjectSector.ENERGY,
      budget: 250.0,
      startDate: '2023-01-01',
      expectedEndDate: '2027-12-31',
      currentRisk: RiskLevel.MEDIUM,
      riskFactors: [
        'Policy uncertainty',
        'Technology adoption challenges',
        'Integration with existing infrastructure'
      ],
      impactAnalysis: 'Project proceeding with standard implementation timeline. Economic indicators suggest stable environment for continued progress.'
    },
    {
      id: 'default-002',
      name: 'Sustainable Agriculture Initiative',
      description: 'Modernizing agricultural practices for improved sustainability and climate resilience',
      country: '',
      status: ProjectStatus.ON_HOLD,
      sector: ProjectSector.AGRICULTURE,
      budget: 175.5,
      startDate: '2024-03-01',
      expectedEndDate: '2028-02-28',
      currentRisk: RiskLevel.HIGH,
      riskFactors: [
        'Climate change impacts',
        'Economic pressures on agricultural sector',
        'Policy implementation challenges',
        'Stakeholder resistance'
      ],
      impactAnalysis: 'Project faces significant uncertainty due to changing economic conditions and climate impacts exceeding initial projections.'
    }
  ]
};

// Helper function to get projects for a specific country
export const getCountryProjects = (countryCode: string): Project[] => {
  if (sampleProjects[countryCode]) {
    return sampleProjects[countryCode].map(project => ({
      ...project,
      country: countryCode
    }));
  } else {
    return sampleProjects.DEFAULT.map(project => ({
      ...project,
      country: countryCode
    }));
  }
};

// Helper to update project risk based on country analysis
export const updateProjectRisks = (projects: Project[], gdpGrowth: number, inflation: number, newsImpact: number): Project[] => {
  return projects.map(project => {
    // Copy the original project
    const updatedProject = { ...project };
    
    // Store previous risk level
    updatedProject.previousRisk = project.currentRisk;
    
    // Calculate risk factors (simplified algorithm)
    let riskScore = 0;
    
    // Economic factors impact
    if (gdpGrowth < 0) riskScore += 2;
    else if (gdpGrowth < 1) riskScore += 1;
    else if (gdpGrowth > 3) riskScore -= 1;
    
    if (inflation > 7) riskScore += 2;
    else if (inflation > 4) riskScore += 1;
    else if (inflation < 2) riskScore -= 1;
    
    // News sentiment impact
    if (newsImpact < -0.5) riskScore += 2;
    else if (newsImpact < 0) riskScore += 1;
    else if (newsImpact > 0.5) riskScore -= 1;
    
    // Sector-specific adjustments
    switch (project.sector) {
      case ProjectSector.ENERGY:
        // Energy projects are more sensitive to inflation
        if (inflation > 5) riskScore += 1;
        break;
      case ProjectSector.INFRASTRUCTURE:
        // Infrastructure projects are more sensitive to economic downturns
        if (gdpGrowth < 1) riskScore += 1;
        break;
      case ProjectSector.AGRICULTURE:
        // Agriculture projects are more sensitive to news (e.g., climate, trade policies)
        if (newsImpact < 0) riskScore += 1;
        break;
      default:
        break;
    }
    
    // Determine new risk level
    let newRiskLevel = project.currentRisk;
    if (riskScore >= 3) {
      newRiskLevel = RiskLevel.CRITICAL;
    } else if (riskScore >= 1) {
      newRiskLevel = RiskLevel.HIGH;
    } else if (riskScore >= -1) {
      newRiskLevel = RiskLevel.MEDIUM;
    } else {
      newRiskLevel = RiskLevel.LOW;
    }
    
    updatedProject.currentRisk = newRiskLevel;
    
    // Update impact analysis based on risk changes
    if (updatedProject.currentRisk !== updatedProject.previousRisk) {
      if (updatedProject.currentRisk === RiskLevel.CRITICAL) {
        updatedProject.impactAnalysis = `CRITICAL ALERT: Project viability at significant risk due to deteriorating economic conditions (GDP: ${gdpGrowth.toFixed(1)}%, Inflation: ${inflation.toFixed(1)}%) and negative sentiment. Recommend immediate reevaluation.`;
      } else if (updatedProject.currentRisk === RiskLevel.HIGH && updatedProject.previousRisk === RiskLevel.MEDIUM) {
        updatedProject.impactAnalysis = `Risk elevated to HIGH: Economic indicators (GDP: ${gdpGrowth.toFixed(1)}%, Inflation: ${inflation.toFixed(1)}%) and market sentiment have worsened. Budget and timeline pressures expected.`;
      } else if (updatedProject.currentRisk === RiskLevel.MEDIUM && updatedProject.previousRisk === RiskLevel.HIGH) {
        updatedProject.impactAnalysis = `Risk reduced to MEDIUM: Improving economic conditions (GDP: ${gdpGrowth.toFixed(1)}%, Inflation: ${inflation.toFixed(1)}%) support a more favorable outlook, though challenges remain.`;
      } else if (updatedProject.currentRisk === RiskLevel.LOW && updatedProject.previousRisk !== RiskLevel.LOW) {
        updatedProject.impactAnalysis = `Risk decreased to LOW: Strong economic performance (GDP: ${gdpGrowth.toFixed(1)}%, Inflation: ${inflation.toFixed(1)}%) and positive market sentiment support optimal project conditions.`;
      }
    }
    
    return updatedProject;
  });
};