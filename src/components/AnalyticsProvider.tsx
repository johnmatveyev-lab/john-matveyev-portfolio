import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageView, trackPerf } from "@/lib/analytics";
import { onCLS, onLCP, onINP, onTTFB, onFCP } from "web-vitals";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import { useTimeOnPage } from "@/hooks/useTimeOnPage";

export function AnalyticsProvider() {
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
    pageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  // Track Core Web Vitals
  useEffect(() => {
    onCLS((metric) => trackPerf("CLS", metric.value, metric.id));
    onFCP((metric) => trackPerf("FCP", metric.value, metric.id));
    onLCP((metric) => trackPerf("LCP", metric.value, metric.id));
    onINP((metric) => trackPerf("INP", metric.value, metric.id));
    onTTFB((metric) => trackPerf("TTFB", metric.value, metric.id));
  }, []);

  // User engagement tracking
  useScrollDepth();
  useSectionVisibility();
  useTimeOnPage();

  return null;
}
