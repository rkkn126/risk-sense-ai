import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original users table needed for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Country analyses
export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  countryCode: text("country_code").notNull(),
  countryName: text("country_name").notNull(),
  query: text("query").notNull(),
  overview: jsonb("overview").notNull(),
  economicData: jsonb("economic_data").notNull(),
  newsData: jsonb("news_data").notNull(),
  aiInsights: text("ai_insights").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

// Country metadata
export const countries = pgTable("countries", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  region: text("region"),
  incomeLevel: text("income_level"),
  capital: text("capital"),
});

export const insertCountrySchema = createInsertSchema(countries);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Country = typeof countries.$inferSelect;

// Request and Response types for analysis
export const analysisRequestSchema = z.object({
  countryCode: z.string().min(2),
  query: z.string().min(1)
});

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;

// Extending types for UI
export type OverviewData = {
  population: string;
  populationYear: string;
  gdp: string;
  gdpPerCapita: string;
  government: string;
  summary: string[];
};

export type EconomicIndicator = {
  indicator: string;
  value: string;
  year: string;
  change: {
    value: string;
    direction: "up" | "down" | "none";
  };
  globalRank?: string;
};

export type NewsItem = {
  title: string;
  source: string;
  date: string;
  description: string;
  url: string;
  imageUrl?: string;
  tags: string[];
};

export type NewsSentiment = {
  neutral: number;
  positive: number;
  negative: number;
  summary: string;
};

export type FollowUpQuestion = {
  question: string;
};

export type CountryOption = {
  code: string;
  name: string;
};

export type TabType = 'overview' | 'economic' | 'news' | 'ai' | 'climate' | 'p3' | 'risk' | 'riskrating';

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
