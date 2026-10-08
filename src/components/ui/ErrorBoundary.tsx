"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  children: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, showDetails: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[DentalOS ErrorBoundary caught in ${this.props.componentName || "Component"}]:`,
      error,
      errorInfo
    );
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 m-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>
                Isolated Component Error: {this.props.componentName || "Subsystem"}
              </span>
            </div>
            <button
              onClick={this.handleReset}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition flex items-center gap-1 text-[11px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Component</span>
            </button>
          </div>

          <p className="text-[11px] text-rose-900 leading-relaxed">
            {this.state.error?.message || "An unexpected rendering error occurred in this module."}
          </p>

          <button
            onClick={() => this.setState({ showDetails: !this.state.showDetails })}
            className="text-[10px] font-bold text-rose-700 flex items-center gap-1 hover:underline"
          >
            <span>{this.state.showDetails ? "Hide Stack Trace" : "View Debug Trace"}</span>
            {this.state.showDetails ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>

          {this.state.showDetails && (
            <pre className="p-2.5 bg-rose-100/80 rounded-lg text-[9px] font-mono text-rose-950 overflow-x-auto max-h-40 whitespace-pre-wrap">
              {this.state.error?.stack}
              {"\nComponent Stack:\n"}
              {this.state.errorInfo?.componentStack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
