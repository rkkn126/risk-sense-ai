import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error | null | unknown;
  isVisible: boolean;
  onRetry: () => void;
}

export default function ErrorState({ error, isVisible, onRetry }: ErrorStateProps) {
  if (!isVisible) return null;

  const errorMessage = error instanceof Error 
    ? error.message 
    : "An unexpected error occurred. Please try again.";

  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-md mb-8">
      <div className="rounded-full bg-red-100 p-3 text-red-500 mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Unable to complete analysis
      </h3>
      <p className="text-gray-600 mb-4 text-center max-w-md">
        {errorMessage}
      </p>
      <Button
        onClick={onRetry}
        className="gap-2"
      >
        Try Again
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
