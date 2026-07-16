"use client";

import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

import { AppButton, AppCard, AppSection, spacing, typography } from "@/design-system";

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
      <AppSection spacing="lg">
        <AppCard className={`${spacing.inset.lg} ${spacing.stack.md}`}>
          <h1 className={`${typography.hierarchy.heading} ${typography.tone.primary}`}>
            حدث خطأ غير متوقع
          </h1>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            يمكنك إعادة المحاولة أو العودة إلى الرئيسية.
          </p>
          <div className={`flex flex-wrap ${spacing.inline.sm}`}>
            <AppButton onClick={this.retry}>إعادة المحاولة</AppButton>
            <AppButton onClick={this.goHome} tone="outline">
              العودة إلى الرئيسية
            </AppButton>
          </div>
        </AppCard>
      </AppSection>
    );
  }
}
