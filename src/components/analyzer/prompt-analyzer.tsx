"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { handleAnalyzePrompt } from "@/app/generator/actions";
import { Wand2, Sparkles, Check, Copy, Download, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { RefineGeneratedPromptOutput } from "@/ai/flows/refine-generated-prompt";
import { FormattedPrompt } from "../generator/formatted-prompt";
import { Skeleton } from "../ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const formSchema = z.object({
  prompt: z
    .string()
    .min(10, {
      message: "Please enter a prompt of at least 10 characters.",
    })
    .max(2000, {
      message: "The prompt is too long. Please keep it under 2000 characters.",
    }),
});

export function PromptAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<RefineGeneratedPromptOutput | null>(null);
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setAnalysisResult(null);
    setShowEnhanced(false);
    const result = await handleAnalyzePrompt({ initialPrompt: values.prompt });
    setLoading(false);

    if (result.success && result.analysis) {
      setAnalysisResult(result.analysis);
    } else {
      toast({
        title: "Error",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  const handleCopy = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult.enhancedPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!analysisResult) return;
    const blob = new Blob([analysisResult.enhancedPrompt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enhanced-prompt.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Your Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your existing prompt here..."
                        className="min-h-[250px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full" size="lg">
                <Wand2 className="mr-2 h-5 w-5" />
                {loading ? "Analyzing..." : "Analyze Prompt"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="lg:mt-0">
         <Card className="h-full flex flex-col prompt-glow">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Analysis Result</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            {loading ? (
              <div className="space-y-4 p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">🧩</span> Prompt Analysis
                  </h3>
                  <p className="text-muted-foreground">{analysisResult.analysis}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">🎯</span> Prompt Score: {analysisResult.score}/100
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Clarity: {analysisResult.clarity}/25</li>
                    <li>Completeness: {analysisResult.completeness}/25</li>
                    <li>Creativity: {analysisResult.creativity}/25</li>
                    <li>Goal Relevance: {analysisResult.goalRelevance}/25</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">⚠️</span> Missing or Weak Points
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {analysisResult.weakPoints.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                </div>
                
                <Accordion type="single" collapsible onValueChange={(value) => setShowEnhanced(!!value)}>
                  <AccordionItem value="item-1">
                    <AccordionTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Show Enhanced Prompt
                      </Button>
                    </AccordionTrigger>
                    <AccordionContent className="mt-4">
                      <CardHeader className="px-0">
                        <CardTitle className="flex justify-between items-center">
                          <span className="text-lg">✨ Enhanced Prompt</span>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy prompt">
                              {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download prompt">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <FormattedPrompt prompt={analysisResult.enhancedPrompt} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full border border-dashed rounded-lg p-8">
                <Bot className="h-12 w-12 mb-4" />
                <p>Your prompt analysis will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
