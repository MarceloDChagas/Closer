import React from 'react';

export const PageFooter: React.FC = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="font-bold text-xl text-foreground">ESTUDIO CLOSER</div>
        </div>
        <p className="text-sm text-muted-foreground">© 2025 Estudio Closer. Sistema de Gerenciamento.</p>
      </div>
    </footer>
  );
}; 