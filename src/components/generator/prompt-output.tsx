"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy, Download, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleRefinePrompt } from "@/app/generator/actions";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface PromptOutputProps {
  prompt: string;
  isLoading: boolean;
  setPrompt: (prompt: string) => void;
}

export function PromptOutput({ prompt, isLoading, setPrompt }: PromptOutputProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!prompt) return;
    const blob = new Blob([prompt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const onRefine = async () => {
    if (!prompt) return;
    setIsRefining(true);
    const result = await handleRefinePrompt({ initialPrompt: prompt });
    setIsRefining(false);
    if (result.success && result.prompt) {
      setPrompt(result.prompt);
      toast({
        title: "Success",
        description: "Your prompt has been refined!",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to refine prompt.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={cn("h-full flex flex-col", (prompt || isLoading) && "prompt-glow")}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Generated Prompt</span>
          {(prompt && !isLoading) && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                aria-label="Copy prompt"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                aria-label="Download prompt"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : prompt ? (
          <div className="flex-grow flex flex-col justify-between">
            <pre className="whitespace-pre-wrap text-sm text-foreground font-sans flex-grow bg-secondary/50 p-4 rounded-md">
              {prompt}
            </pre>
            <Button onClick={onRefine} disabled={isRefining} className="mt-4 w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {isRefining ? 'Refining...' : 'Refine with AI'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full border border-dashed rounded-lg p-8">
            <Bot className="h-12 w-12 mb-4" />
            <p>Your generated prompt will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
