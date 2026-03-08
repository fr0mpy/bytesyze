import React from 'react'

interface ErrorBoundaryProps {
  name: string
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ComponentErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `Component error in ${this.props.name}:`,
      error,
      errorInfo,
    )
    this.setState({ errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          data-testid="component-error"
          className="min-h-[300px] flex items-center justify-center p-8"
        >
          <div className="max-w-2xl w-full bg-destructive/10 border-2 border-destructive rounded-theme-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center font-bold">
                !
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-heading text-lg font-semibold text-destructive">
                  Component Error: {this.props.name}
                </h3>
                <p className="text-sm text-foreground font-medium">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
                {this.state.error?.stack && (
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer hover:text-foreground transition-colors">
                      Stack trace
                    </summary>
                    <pre className="mt-2 p-3 bg-muted rounded-theme-md overflow-x-auto font-mono">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
            <button
              onClick={this.handleRetry}
              className="w-full bg-destructive text-destructive-foreground px-4 py-2 rounded-theme-md font-medium hover:bg-destructive/90 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
            >
              Retry Component
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
