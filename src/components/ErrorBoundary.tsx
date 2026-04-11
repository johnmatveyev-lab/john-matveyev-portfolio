import React, { Component, ErrorInfo, ReactNode } from "react";
import { trackError } from "@/lib/analytics";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    trackError(error, errorInfo.componentStack);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground text-center">
          <h2 className="text-2xl font-bold mb-4 font-display">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            An unexpected error occurred. The issue has been reported.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
