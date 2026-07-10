"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class NotesErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('NotesFeature Error:', error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
        // Optional: reload window if state is truly corrupted
        // window.location.reload(); 
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-background">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                    <p className="text-muted-foreground max-w-md mb-6">
                        We encountered an error while loading your notes.
                    </p>
                    <div className="flex items-center gap-4">
                        <Button onClick={this.handleRetry} variant="outline">
                            Try Again
                        </Button>
                        <Button onClick={() => window.location.reload()} variant="default">
                            Reload Page
                        </Button>
                    </div>
                    {this.state.error && (
                        <div className="mt-8 p-4 rounded bg-muted/50 text-left max-w-lg w-full overflow-auto text-xs font-mono text-muted-foreground">
                            {this.state.error.toString()}
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
