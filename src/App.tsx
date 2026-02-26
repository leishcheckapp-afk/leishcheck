import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AudioToggle } from "@/components/AudioToggle";
import Home from "./pages/Home";
import Consent from "./pages/Consent";
import UserDataPage from "./pages/UserDataPage";
import Questionnaire from "./pages/Questionnaire";
import ImageUpload from "./pages/ImageUpload";
import Result from "./pages/Result";
import Education from "./pages/Education";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/consentimento" element={<Consent />} />
        <Route path="/dados" element={<UserDataPage />} />
        <Route path="/questionario" element={<Questionnaire />} />
        <Route path="/imagem" element={<ImageUpload />} />
        <Route path="/resultado" element={<Result />} />
        <Route path="/educacao" element={<Education />} />
        <Route path="/historico" element={<History />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AudioToggle />
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
