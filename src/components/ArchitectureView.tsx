import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor: '#8B5CF6',
    primaryTextColor: '#fff',
    primaryBorderColor: '#8B5CF6',
    lineColor: '#6366F1',
    secondaryColor: '#10B981',
    tertiaryColor: '#F43F5E',
  }
});

interface ArchitectureViewProps {
  definition: string;
}

const ArchitectureView: React.FC<ArchitectureViewProps> = ({ definition }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.contentLoaded();
      // Remove any existing children to prevent re-render issues
      containerRef.current.innerHTML = `<div class="mermaid">${definition}</div>`;
      mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, definition).then((result) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = result.svg;
        }
      });
    }
  }, [definition]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/50 bg-secondary/20 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-widest text-gold">System Architecture</h4>
        <div className="flex gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span className="h-2 w-2 rounded-full bg-rose-500" />
        </div>
      </div>
      <div 
        ref={containerRef} 
        className="flex justify-center transition-opacity duration-500 hover:opacity-90"
      />
    </div>
  );
};

export default ArchitectureView;
