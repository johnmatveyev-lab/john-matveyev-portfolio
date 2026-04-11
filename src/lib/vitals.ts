import { onCLS, onLCP, onINP, onFCP, onTTFB, Metric } from 'web-vitals';
import { track } from './analytics';

export function reportWebVitals() {
  const sendToAnalytics = (metric: Metric) => {
    // Determine the event name based on the metric
    const eventName = `web_vitals_${metric.name.toLowerCase()}`;
    
    // Track the vitals metric
    track(eventName, {
      id: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      delta: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
      navigationType: metric.navigationType,
    });
  };

  try {
    onCLS(sendToAnalytics);
    onLCP(sendToAnalytics);
    onINP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  } catch (error) {
    console.warn("Failed to initialized web-vitals", error);
  }
}
