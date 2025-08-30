import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { errorHandler } from '../utils/errorHandler';
import { analytics } from '../utils/analytics';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to our error handling system
    const appError = errorHandler.createError(
      'unknown',
      error.message,
      error.stack,
      'react_error_boundary',
      false
    );

    // Track error in analytics
    analytics.trackError(error.message, 'react_error_boundary');

    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="bg-red-100 rounded-full p-4 inline-block mb-6">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oups ! Une erreur s'est produite
            </h1>
            
            <p className="text-gray-600 mb-6">
              L'application a rencontré un problème inattendu. Nos équipes ont été automatiquement notifiées.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <p className="text-sm font-mono text-gray-800 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Réessayer
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2" />
                Recharger la page
              </button>
            </div>
            
            <p className="mt-6 text-xs text-gray-500">
              Si le problème persiste, contactez notre support technique.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}