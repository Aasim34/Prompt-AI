"use client";

import React from 'react';

interface FormattedPromptProps {
  prompt: string;
}

export function FormattedPrompt({ prompt }: FormattedPromptProps) {
  const renderFormattedText = () => {
    const lines = prompt.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="mb-1">
            <span className="font-bold text-primary">{line.replace(/\*\*/g, '')}</span>
          </div>
        );
      }
      
      const bulletMatch = line.match(/^(\s*)(\*|\-|\d+\.)\s(.*)/);
      if (bulletMatch) {
        const [, indent, bullet, content] = bulletMatch;
        return (
          <div key={index} className="flex items-start pl-4 mb-1">
            <span className="text-primary mr-2">{bullet}</span>
            <span>{content}</span>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      
      return <p key={index} className="mb-1">{line}</p>;
    });
  };

  return (
    <div className="whitespace-pre-wrap text-sm text-foreground font-sans flex-grow bg-secondary/50 p-4 rounded-md">
      {renderFormattedText()}
    </div>
  );
}
