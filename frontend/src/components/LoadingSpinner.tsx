import React from 'react';
import { ScrollHeader } from './scroll-header';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Carregando...",
  fullPage = true 
}) => {
  const content = (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  );

  if (!fullPage) {
    return (
      <div className="flex items-center justify-center py-8">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <ScrollHeader />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        {content}
      </main>
    </div>
  );
}; 