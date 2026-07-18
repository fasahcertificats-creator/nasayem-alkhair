"use client";

import { AlertCircle } from "lucide-react";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

import { AppButton } from "@/design-system";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorBoundary]", error, errorInfo);
    }
  }

  private retry = (): void => {
    this.setState({
      hasError: false
    });
  };

  private goHome = (): void => {
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="px-5 py-8 text-right" dir="rtl">
        <div className="rounded-[22px] border border-border bg-white p-5 shadow-soft">
          <div className="space-y-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-gold">
              <AlertCircle className="size-5" strokeWidth={1.7} />
            </div>
            <div className="space-y-2">
              <h1 className="text-heading text-primary">حدث خطأ غير متوقع</h1>
              <p className="text-body-premium text-muted-foreground">
                يمكنك إعادة المحاولة أو العودة إلى الصفحة الرئيسية.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <AppButton onClick={this.retry}>إعادة المحاولة</AppButton>
              <AppButton onClick={this.goHome} tone="outline">
                العودة للرئيسية
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
