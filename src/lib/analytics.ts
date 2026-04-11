type Props = Record<string, any>;

export function track(event: string, props: Props = {}) {
  if (typeof window === "undefined") return;
  const withContext = { ...props, path: window.location.pathname };
  
  if ((window as any).posthog) {
    (window as any).posthog.capture(event, withContext);
  }
  
  if ((window as any).gtag) {
    (window as any).gtag("event", event, withContext);
  }
  
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, withContext);
  }
}

export function pageView(url: string) {
  track("page_view", { url });
}

export function trackError(error: Error, componentStack?: string) {
  track("error", { 
    message: error.message, 
    stack: error.stack,
    componentStack 
  });
  if (import.meta.env.DEV) {
    console.error("[analytics error reported]", error, componentStack);
  }
}

export function trackPerf(metricName: string, value: number, id?: string) {
  track("web_vitals", { metricName, value, id });
}
