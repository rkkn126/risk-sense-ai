import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/Home";
import NIBRecommendations from "@/pages/NIBRecommendations";
import AppLayout from "@/components/AppLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/nib" component={NIB} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Home page wrapper
function Home() {
  return <AppLayout activePage="risk-sense" />;
}

// NIB page wrapper
function NIB() {
  return <AppLayout activePage="nib-recommendations" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
