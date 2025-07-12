import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

interface LoadingStateProps {
  isVisible: boolean;
  selectedCountry?: string;
}

export default function LoadingState({ isVisible, selectedCountry }: LoadingStateProps) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [showTip, setShowTip] = useState(false);
  
  const steps = [
    "Fetching economic data",
    "Gathering news articles",
    "Analyzing climate and ESG data",
    "Generating AI insights",
    "Creating P3 investment strategy"
  ];
  
  const tips = [
    "AI analysis may take 30-60 seconds for comprehensive results",
    "We're analyzing thousands of data points for accurate insights",
    "The P3 Strategy uses advanced AI to identify investment risks",
    "The AI is evaluating economic trends across multiple metrics"
  ];

  useEffect(() => {
    if (!isVisible) return;
    
    // Show random tip after 5 seconds
    const tipTimer = setTimeout(() => {
      setShowTip(true);
    }, 5000);
    
    // Progress through loading steps
    let stepCounter = 0;
    const stepTimer = setInterval(() => {
      if (stepCounter < steps.length - 1) {
        stepCounter++;
        setLoadingStep(stepCounter);
      } else {
        clearInterval(stepTimer);
      }
    }, 2500);
    
    return () => {
      clearTimeout(tipTimer);
      clearInterval(stepTimer);
      setLoadingStep(0);
      setShowTip(false);
    };
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  // Select random tip
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-md mb-8">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full mb-6 animate-spin"></div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Analyzing data for{" "}
        <span className="font-bold text-primary">{selectedCountry || "selected country"}</span>
      </h3>
      
      <div className="w-full max-w-md space-y-2 px-4 mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            {index < loadingStep ? (
              <span className="w-5 h-5 flex-shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                <Check className="w-3 h-3" />
              </span>
            ) : index === loadingStep ? (
              <span className="w-5 h-5 flex-shrink-0 rounded-full border-2 border-primary animate-pulse mr-3"></span>
            ) : (
              <span className="w-5 h-5 flex-shrink-0 rounded-full border-2 border-gray-200 mr-3"></span>
            )}
            <span className={`text-sm ${index <= loadingStep ? 'text-gray-800' : 'text-gray-400'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      
      {showTip && (
        <div className="mt-2 px-6 py-3 bg-blue-50 rounded-lg text-sm text-blue-800 max-w-md text-center">
          <span className="font-medium">Tip:</span> {randomTip}
        </div>
      )}
      
      <div className="mt-8 px-6 py-4 bg-gray-50 border border-gray-100 rounded-lg max-w-lg">
        <h4 className="text-sm font-semibold mb-3 text-gray-700">Using the following data sources and AI:</h4>
        <ul className="text-xs text-gray-600 space-y-2">
          <li className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
            <span>World Bank API for economic indicators and country data</span>
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
            <span>News API for recent articles and sentiment analysis</span>
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-teal-500 mr-2"></div>
            <span>CDP data for climate and environmental insights</span>
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
            <span>Mistral Small 3.1 24B for AI analysis via OpenRouter API</span>
          </li>
        </ul>
        <div className="mt-3 text-xs text-gray-500">
          <p className="italic">Implementing Retrieval-Augmented Generation (RAG) by combining relevant data from multiple sources to create context-aware AI insights</p>
        </div>
      </div>
    </div>
  );
}
