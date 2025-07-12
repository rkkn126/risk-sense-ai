// Credit ratings data (Standard & Poor's)
// Source: Wikipedia - List of countries by credit rating
// https://en.wikipedia.org/wiki/List_of_countries_by_credit_rating#Standard_&_Poor's

export interface CreditRating {
  countryCode: string;
  rating: string;
  outlook: string;
  dateUpdated: string;
}

// Standard & Poor's credit ratings
export const creditRatings: CreditRating[] = [
  { countryCode: "AUS", rating: "AAA", outlook: "Stable", dateUpdated: "2023-06-14" },
  { countryCode: "CAN", rating: "AAA", outlook: "Stable", dateUpdated: "2023-07-14" },
  { countryCode: "DNK", rating: "AAA", outlook: "Stable", dateUpdated: "2023-08-11" },
  { countryCode: "DEU", rating: "AAA", outlook: "Stable", dateUpdated: "2023-11-17" },
  { countryCode: "LUX", rating: "AAA", outlook: "Stable", dateUpdated: "2024-01-19" },
  { countryCode: "NLD", rating: "AAA", outlook: "Stable", dateUpdated: "2023-11-17" },
  { countryCode: "NOR", rating: "AAA", outlook: "Stable", dateUpdated: "2023-09-08" },
  { countryCode: "SGP", rating: "AAA", outlook: "Stable", dateUpdated: "2023-08-18" },
  { countryCode: "SWE", rating: "AAA", outlook: "Stable", dateUpdated: "2023-09-22" },
  { countryCode: "CHE", rating: "AAA", outlook: "Stable", dateUpdated: "2023-09-15" },
  { countryCode: "USA", rating: "AA+", outlook: "Stable", dateUpdated: "2023-08-03" },
  { countryCode: "FIN", rating: "AA+", outlook: "Stable", dateUpdated: "2023-09-15" },
  { countryCode: "NZL", rating: "AA+", outlook: "Positive", dateUpdated: "2024-02-02" },
  { countryCode: "AUT", rating: "AA+", outlook: "Stable", dateUpdated: "2023-09-15" },
  { countryCode: "HKG", rating: "AA+", outlook: "Negative", dateUpdated: "2023-07-28" },
  { countryCode: "GBR", rating: "AA", outlook: "Stable", dateUpdated: "2023-06-16" },
  { countryCode: "FRA", rating: "AA", outlook: "Negative", dateUpdated: "2023-12-01" },
  { countryCode: "KOR", rating: "AA", outlook: "Stable", dateUpdated: "2023-11-24" },
  { countryCode: "ARE", rating: "AA", outlook: "Stable", dateUpdated: "2023-11-17" },
  { countryCode: "BEL", rating: "AA", outlook: "Stable", dateUpdated: "2023-11-17" },
  { countryCode: "EST", rating: "AA-", outlook: "Stable", dateUpdated: "2023-07-21" },
  { countryCode: "ISR", rating: "AA-", outlook: "Negative", dateUpdated: "2023-10-17" },
  { countryCode: "CZE", rating: "AA-", outlook: "Stable", dateUpdated: "2024-02-02" },
  { countryCode: "QAT", rating: "AA-", outlook: "Stable", dateUpdated: "2023-09-29" },
  { countryCode: "TWN", rating: "AA-", outlook: "Stable", dateUpdated: "2023-04-14" },
  { countryCode: "CHL", rating: "A+", outlook: "Stable", dateUpdated: "2023-07-14" },
  { countryCode: "IRL", rating: "A+", outlook: "Positive", dateUpdated: "2023-11-24" },
  { countryCode: "JPN", rating: "A+", outlook: "Stable", dateUpdated: "2023-07-14" },
  { countryCode: "SVN", rating: "A+", outlook: "Stable", dateUpdated: "2023-08-11" },
  { countryCode: "SAU", rating: "A+", outlook: "Positive", dateUpdated: "2023-09-29" },
  { countryCode: "ESP", rating: "A", outlook: "Positive", dateUpdated: "2023-09-22" },
  { countryCode: "LVA", rating: "A", outlook: "Stable", dateUpdated: "2023-09-01" },
  { countryCode: "LTU", rating: "A", outlook: "Stable", dateUpdated: "2023-08-25" },
  { countryCode: "MLT", rating: "A", outlook: "Stable", dateUpdated: "2024-02-16" },
  { countryCode: "SVK", rating: "A", outlook: "Stable", dateUpdated: "2023-07-14" },
  { countryCode: "CHN", rating: "A+", outlook: "Stable", dateUpdated: "2023-07-28" },
  { countryCode: "MYS", rating: "A-", outlook: "Stable", dateUpdated: "2023-06-30" },
  { countryCode: "ITA", rating: "BBB", outlook: "Positive", dateUpdated: "2023-10-20" },
  { countryCode: "POL", rating: "A-", outlook: "Stable", dateUpdated: "2023-10-06" },
  { countryCode: "PRT", rating: "BBB+", outlook: "Stable", dateUpdated: "2023-09-08" },
  { countryCode: "HRV", rating: "BBB+", outlook: "Stable", dateUpdated: "2023-10-27" },
  { countryCode: "BGR", rating: "BBB", outlook: "Positive", dateUpdated: "2023-11-24" },
  { countryCode: "COL", rating: "BB+", outlook: "Stable", dateUpdated: "2023-12-07" },
  { countryCode: "HUN", rating: "BBB", outlook: "Stable", dateUpdated: "2023-08-11" },
  { countryCode: "IDN", rating: "BBB", outlook: "Stable", dateUpdated: "2023-06-02" },
  { countryCode: "IND", rating: "BBB-", outlook: "Stable", dateUpdated: "2023-09-15" },
  { countryCode: "KAZ", rating: "BBB-", outlook: "Stable", dateUpdated: "2023-09-01" },
  { countryCode: "MEX", rating: "BBB", outlook: "Stable", dateUpdated: "2023-07-07" },
  { countryCode: "MAR", rating: "BB+", outlook: "Stable", dateUpdated: "2023-03-31" },
  { countryCode: "PER", rating: "BBB", outlook: "Negative", dateUpdated: "2023-06-16" },
  { countryCode: "PHL", rating: "BBB+", outlook: "Stable", dateUpdated: "2023-09-15" },
  { countryCode: "ROU", rating: "BBB-", outlook: "Stable", dateUpdated: "2023-10-06" },
  { countryCode: "RUS", rating: "CCC+", outlook: "Stable", dateUpdated: "2023-08-11" },
  { countryCode: "ZAF", rating: "BB-", outlook: "Stable", dateUpdated: "2023-11-24" },
  { countryCode: "THA", rating: "BBB+", outlook: "Stable", dateUpdated: "2023-08-18" },
  { countryCode: "TUR", rating: "B", outlook: "Positive", dateUpdated: "2023-12-15" },
  { countryCode: "UKR", rating: "CCC+", outlook: "Negative", dateUpdated: "2023-09-15" },
  { countryCode: "URY", rating: "BBB", outlook: "Stable", dateUpdated: "2023-04-28" },
  { countryCode: "VNM", rating: "BB+", outlook: "Positive", dateUpdated: "2023-05-26" },
  { countryCode: "BRA", rating: "BB-", outlook: "Stable", dateUpdated: "2023-12-20" },
  { countryCode: "GRC", rating: "BBB+", outlook: "Stable", dateUpdated: "2023-09-22" },
  { countryCode: "ISL", rating: "A", outlook: "Stable", dateUpdated: "2023-08-25" },
  { countryCode: "AGO", rating: "B-", outlook: "Stable", dateUpdated: "2023-11-17" },
  { countryCode: "ARG", rating: "CCC-", outlook: "Negative", dateUpdated: "2023-09-15" },
  { countryCode: "EGY", rating: "B-", outlook: "Stable", dateUpdated: "2023-10-27" },
  { countryCode: "NGA", rating: "B-", outlook: "Stable", dateUpdated: "2023-09-08" },
  { countryCode: "PAK", rating: "CCC+", outlook: "Stable", dateUpdated: "2023-08-25" }
];

// Get credit rating by country code
export function getCreditRating(countryCode: string): CreditRating | undefined {
  return creditRatings.find(rating => rating.countryCode === countryCode);
}

// Get rating color for styling
export function getRatingColor(rating: string): string {
  // Higher ratings (investment grade)
  if (rating.startsWith('AAA') || rating.startsWith('AA+')) {
    return 'text-green-600';
  } else if (rating.startsWith('AA') || rating.startsWith('A+')) {
    return 'text-green-500';
  } else if (rating.startsWith('A')) {
    return 'text-emerald-500';
  } else if (rating.startsWith('BBB')) {
    return 'text-teal-500';
  } 
  // Lower ratings (speculative)
  else if (rating.startsWith('BB')) {
    return 'text-yellow-500';
  } else if (rating.startsWith('B')) {
    return 'text-orange-500';
  } else if (rating.startsWith('CCC')) {
    return 'text-red-500';
  } else if (rating.startsWith('CC') || rating.startsWith('C')) {
    return 'text-red-600';
  } else if (rating === 'D') {
    return 'text-red-700';
  }
  
  // Default
  return 'text-gray-600';
}

// Get outlook color for styling
export function getOutlookColor(outlook: string): string {
  switch (outlook.toLowerCase()) {
    case 'positive':
      return 'text-green-600';
    case 'stable':
      return 'text-blue-600';
    case 'negative':
      return 'text-red-600';
    case 'watch negative':
      return 'text-orange-600';
    default:
      return 'text-gray-600';
  }
}