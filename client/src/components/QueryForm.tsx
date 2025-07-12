import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lightbulb } from "lucide-react";
import { analysisRequestSchema, AnalysisRequest } from "@shared/schema";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CountryOption } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface QueryFormProps {
  onSubmit: (data: AnalysisRequest) => void;
  isLoading: boolean;
  countries: CountryOption[];
  isCountriesLoading: boolean;
}

// Extending the schema for better validation
const formSchema = analysisRequestSchema.extend({
  query: z.string().min(3, {
    message: "Please enter a more specific question or topic (at least 3 characters).",
  }),
  countryCode: z.string().min(2, {
    message: "Please select a country."
  })
});

export default function QueryForm({ onSubmit, isLoading, countries, isCountriesLoading }: QueryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryCode: "",
      query: ""
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <section className="bg-gradient-to-b from-white to-[#f7fbfc] rounded-lg shadow-md p-6 mb-8 border border-[#e0f0f5]">
      <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#0a6990] via-[#0a7e4a] to-[#0a6990] text-transparent bg-clip-text tracking-tight relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-[#0a6990] after:to-[#0a7e4a]">
        Risk Sense AI - Smart Investment Analysis
      </h2>
      <p className="text-lg font-bold mb-3 px-3 py-1 mx-auto w-fit rounded-full bg-gradient-to-r from-[#0a7e4a]/10 to-[#0a6990]/10 border border-[#add8e6] shadow-sm">
        <span className="bg-gradient-to-r from-[#0a7e4a] to-[#0a6990] bg-clip-text text-transparent animate-pulse">
          ✨ Where Machines Think, and Humans Lead the Charge ✨
        </span>
      </p>
      <p className="text-sm mb-4 p-2 bg-white/50 border-l-4 border-[#0a7e4a] rounded shadow-inner">
        <span className="font-medium text-[#0a6990]">Harness the power of AI</span> to get comprehensive country insights with 
        <span className="px-1 mx-1 bg-[#edf7fa] text-[#0a6990] rounded-sm">economic data</span>, 
        <span className="px-1 mx-1 bg-[#eef7f1] text-[#0a7e4a] rounded-sm">news analysis</span>, 
        <span className="px-1 mx-1 bg-[#f0f7fa] text-[#024d80] rounded-sm">climate information</span>, and 
        <span className="px-1 mx-1 bg-[#eef7f1] text-[#0a7e4a] font-semibold rounded-sm">P3 (Predict, Prevent, Protect)</span> strategic investment recommendations.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#0a6990] font-medium">Select Country</FormLabel>
                  {isCountriesLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#f0f7fa] border-[#add8e6] focus:border-[#0a6990] focus:ring-[#0a6990]/20 hover:bg-[#e6f3f7]">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-[#add8e6]">
                        {countries.map((country) => (
                          <SelectItem 
                            key={country.code} 
                            value={country.code}
                            className="focus:bg-[#f0f7fa] focus:text-[#0a6990]"
                          >
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#0a7e4a] font-medium">Investment Query or Topic</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g., Renewable energy investment, Manufacturing sector, Technology startups, Market risks"
                      {...field}
                      disabled={isLoading}
                      className="bg-[#eef7f1] border-[#addec6] focus-visible:ring-[#0a7e4a]/20 focus-visible:border-[#0a7e4a] hover:bg-[#e6f3ea]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="gap-2 bg-gradient-to-r from-[#0a6990] to-[#0a7e4a] hover:from-[#085980] hover:to-[#086e3a] text-white border-none"
            >
              {isLoading ? 'Analyzing...' : 'Generate Insights'}
              <Lightbulb className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
