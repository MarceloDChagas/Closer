import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Database, AlertTriangle } from "lucide-react";
import { USE_MOCK_DATA } from "../services/mockData";

export const MockDataNotice: React.FC = () => {
  if (!USE_MOCK_DATA) {
    return null;
  }

  return (
    <Alert className="mb-6 border-amber-500/20 bg-amber-500/10">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-200">
        Dados de Demonstração
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          <span>
            Atualmente exibindo dados de exemplo para demonstração. 
            Os dados mostrados não são reais e servem apenas para testar a interface.
          </span>
        </div>
      </AlertDescription>
    </Alert>
  );
}; 