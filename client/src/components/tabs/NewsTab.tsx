import { AnalysisResult } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface NewsTabProps {
  data: AnalysisResult;
}

const COLORS = ["#8B5CF6", "#10B981", "#EF4444"];

export default function NewsTab({ data }: NewsTabProps) {
  const { newsData } = data;
  const { items, sentiment } = newsData;

  // Transform sentiment data for the pie chart
  const sentimentData = [
    { name: "Neutral", value: sentiment.neutral },
    { name: "Positive", value: sentiment.positive },
    { name: "Negative", value: sentiment.negative }
  ];

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6">Recent News Analysis</h2>
      
      <div className="space-y-6">
        {items.map((item, index) => (
          <div 
            key={index}
            className={`border-b border-gray-200 pb-6 ${index === items.length - 1 ? 'last:border-0 last:pb-0' : ''}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={`${item.source} news thumbnail`} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <span>{item.source}</span>
                  <span className="mx-2">•</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-600">{item.description}</p>
              {item.url && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline text-sm mt-2 inline-block"
                >
                  Read more
                </a>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag, tagIndex) => (
                <Badge
                  key={tagIndex}
                  variant="outline"
                  className={`
                    ${tag.toLowerCase().includes('economy') ? 'bg-blue-100 text-blue-800' : ''}
                    ${tag.toLowerCase().includes('technology') ? 'bg-green-100 text-green-800' : ''}
                    ${tag.toLowerCase().includes('policy') ? 'bg-purple-100 text-purple-800' : ''}
                    ${tag.toLowerCase().includes('real') ? 'bg-red-100 text-red-800' : ''}
                    ${tag.toLowerCase().includes('employment') ? 'bg-yellow-100 text-yellow-800' : ''}
                  `}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">News Sentiment Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gray-50">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-semibold text-blue-600 mb-2">
                {Math.round(sentiment.neutral)}%
              </div>
              <div className="text-sm text-gray-600">Neutral Coverage</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-semibold text-green-600 mb-2">
                {Math.round(sentiment.positive)}%
              </div>
              <div className="text-sm text-gray-600">Positive Coverage</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-semibold text-red-600 mb-2">
                {Math.round(sentiment.negative)}%
              </div>
              <div className="text-sm text-gray-600">Negative Coverage</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-600">
              {sentiment.summary}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
