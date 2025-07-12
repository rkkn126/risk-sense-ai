// Natural disaster risk data
// Source: Wikipedia - List of countries by natural disaster risk
// https://en.wikipedia.org/wiki/List_of_countries_by_natural_disaster_risk

export interface DisasterRisk {
  countryCode: string;
  wriRank?: number;  // World Risk Index rank
  wriScore?: number; // World Risk Index score
  exposureScore?: number; // Exposure score
  vulnerabilityScore?: number; // Vulnerability score
  year: number;
}

// Natural disaster risk data
export const disasterRiskData: DisasterRisk[] = [
  // Top risk countries
  { countryCode: "VUT", wriRank: 1, wriScore: 49.74, exposureScore: 86.83, vulnerabilityScore: 57.28, year: 2022 },
  { countryCode: "SLB", wriRank: 2, wriScore: 32.29, exposureScore: 57.71, vulnerabilityScore: 55.94, year: 2022 },
  { countryCode: "TON", wriRank: 3, wriScore: 29.42, exposureScore: 61.17, vulnerabilityScore: 48.09, year: 2022 },
  { countryCode: "DOM", wriRank: 4, wriScore: 27.82, exposureScore: 49.37, vulnerabilityScore: 56.36, year: 2022 },
  { countryCode: "PHL", wriRank: 5, wriScore: 27.52, exposureScore: 45.40, vulnerabilityScore: 60.62, year: 2022 },
  { countryCode: "BGD", wriRank: 6, wriScore: 26.43, exposureScore: 37.82, vulnerabilityScore: 69.88, year: 2022 },
  { countryCode: "KIR", wriRank: 7, wriScore: 24.77, exposureScore: 39.53, vulnerabilityScore: 62.67, year: 2022 },
  { countryCode: "FJI", wriRank: 8, wriScore: 24.51, exposureScore: 48.55, vulnerabilityScore: 50.48, year: 2022 },
  { countryCode: "CPV", wriRank: 9, wriScore: 23.27, exposureScore: 40.83, vulnerabilityScore: 56.99, year: 2022 },
  { countryCode: "TMP", wriRank: 10, wriScore: 22.58, exposureScore: 35.26, vulnerabilityScore: 64.04, year: 2022 },
  
  // Major economies and developed nations
  { countryCode: "JPN", wriRank: 37, wriScore: 12.58, exposureScore: 39.95, vulnerabilityScore: 31.49, year: 2022 },
  { countryCode: "USA", wriRank: 101, wriScore: 3.82, exposureScore: 13.17, vulnerabilityScore: 29.01, year: 2022 },
  { countryCode: "CHN", wriRank: 89, wriScore: 5.39, exposureScore: 14.96, vulnerabilityScore: 36.03, year: 2022 },
  { countryCode: "IND", wriRank: 64, wriScore: 7.52, exposureScore: 14.77, vulnerabilityScore: 50.91, year: 2022 },
  { countryCode: "GBR", wriRank: 139, wriScore: 2.35, exposureScore: 8.11, vulnerabilityScore: 28.98, year: 2022 },
  { countryCode: "DEU", wriRank: 138, wriScore: 2.36, exposureScore: 7.95, vulnerabilityScore: 29.69, year: 2022 },
  { countryCode: "FRA", wriRank: 132, wriScore: 2.49, exposureScore: 7.99, vulnerabilityScore: 31.16, year: 2022 },
  { countryCode: "AUS", wriRank: 121, wriScore: 3.06, exposureScore: 11.36, vulnerabilityScore: 26.94, year: 2022 },
  { countryCode: "CAN", wriRank: 150, wriScore: 1.76, exposureScore: 6.59, vulnerabilityScore: 26.71, year: 2022 },
  
  // Other notable countries
  { countryCode: "MEX", wriRank: 92, wriScore: 4.75, exposureScore: 14.02, vulnerabilityScore: 33.88, year: 2022 },
  { countryCode: "BRA", wriRank: 112, wriScore: 3.43, exposureScore: 8.08, vulnerabilityScore: 42.45, year: 2022 },
  { countryCode: "IDN", wriRank: 29, wriScore: 13.76, exposureScore: 23.65, vulnerabilityScore: 58.18, year: 2022 },
  { countryCode: "EGY", wriRank: 130, wriScore: 2.62, exposureScore: 5.79, vulnerabilityScore: 45.25, year: 2022 },
  { countryCode: "NGA", wriRank: 83, wriScore: 5.77, exposureScore: 9.62, vulnerabilityScore: 59.98, year: 2022 },
  { countryCode: "TUR", wriRank: 93, wriScore: 4.67, exposureScore: 11.93, vulnerabilityScore: 39.14, year: 2022 },
  { countryCode: "ITA", wriRank: 122, wriScore: 3.03, exposureScore: 10.39, vulnerabilityScore: 29.16, year: 2022 },
  { countryCode: "ESP", wriRank: 135, wriScore: 2.42, exposureScore: 7.99, vulnerabilityScore: 30.29, year: 2022 },
  { countryCode: "KOR", wriRank: 128, wriScore: 2.71, exposureScore: 10.05, vulnerabilityScore: 26.97, year: 2022 },
  { countryCode: "ZAF", wriRank: 95, wriScore: 4.51, exposureScore: 8.78, vulnerabilityScore: 51.37, year: 2022 },
  { countryCode: "RUS", wriRank: 123, wriScore: 3.02, exposureScore: 8.33, vulnerabilityScore: 36.25, year: 2022 },
  
  // Lowest risk countries
  { countryCode: "QAT", wriRank: 181, wriScore: 0.23, exposureScore: 1.49, vulnerabilityScore: 15.44, year: 2022 },
  { countryCode: "ARE", wriRank: 180, wriScore: 0.27, exposureScore: 1.52, vulnerabilityScore: 17.76, year: 2022 },
  { countryCode: "SAU", wriRank: 179, wriScore: 0.29, exposureScore: 1.67, vulnerabilityScore: 17.37, year: 2022 },
  { countryCode: "ISL", wriRank: 177, wriScore: 0.60, exposureScore: 1.91, vulnerabilityScore: 31.41, year: 2022 },
  { countryCode: "BHR", wriRank: 178, wriScore: 0.41, exposureScore: 1.68, vulnerabilityScore: 24.40, year: 2022 },
  { countryCode: "MLT", wriRank: 175, wriScore: 0.67, exposureScore: 2.12, vulnerabilityScore: 31.60, year: 2022 },
  { countryCode: "SGP", wriRank: 160, wriScore: 1.47, exposureScore: 5.30, vulnerabilityScore: 27.74, year: 2022 },
  { countryCode: "SWE", wriRank: 162, wriScore: 1.41, exposureScore: 4.99, vulnerabilityScore: 28.26, year: 2022 },
  { countryCode: "FIN", wriRank: 167, wriScore: 1.23, exposureScore: 4.31, vulnerabilityScore: 28.54, year: 2022 },
  { countryCode: "NOR", wriRank: 163, wriScore: 1.40, exposureScore: 5.07, vulnerabilityScore: 27.61, year: 2022 }
];

// Get disaster risk by country code
export function getDisasterRisk(countryCode: string): DisasterRisk | undefined {
  return disasterRiskData.find(risk => risk.countryCode === countryCode);
}

// Get risk level text based on WRI rank
export function getRiskLevelText(wriRank?: number): string {
  if (!wriRank) return 'Unknown';
  
  if (wriRank <= 30) return 'Extreme';
  if (wriRank <= 60) return 'Very High';
  if (wriRank <= 90) return 'High';
  if (wriRank <= 120) return 'Medium';
  if (wriRank <= 150) return 'Low';
  return 'Very Low';
}

// Get risk color for styling
export function getRiskColor(wriRank?: number): string {
  if (!wriRank) return 'text-gray-500';
  
  if (wriRank <= 30) return 'text-red-600';
  if (wriRank <= 60) return 'text-red-500';
  if (wriRank <= 90) return 'text-orange-500';
  if (wriRank <= 120) return 'text-yellow-500';
  if (wriRank <= 150) return 'text-green-500';
  return 'text-green-600';
}