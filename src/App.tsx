import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import SmoothScroll from "@/components/SmoothScroll";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import { ThemeProvider } from "./components/ThemeProvider";

const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const SkillsPage = lazy(() => import("./pages/SkillsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));

import { PWAPrompt } from "./components/PWAPrompt";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <TooltipProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <PWAPrompt />
              <SmoothScroll />
              <BrowserRouter>
                <AnalyticsProvider />
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin"></div></div>}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/:id" element={<ProjectDetailPage />} />
                    <Route path="/skills" element={<SkillsPage />} />
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
