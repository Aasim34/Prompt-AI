
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
import { Wand2, Bot } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import type { AnalyzeArgumentOutput } from "@/ai/flows/analyze-argument";
import { handleAnalyzeArgument } from "@/app/argument-analyzer/actions";
import { Skeleton } from "../ui/skeleton";
import { Progress } from "../ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const formSchema = z.object({
  text: z
    .string()
    .min(20, {
      message: "Please enter an argument of at least 20 characters.",
    })
    .max(5000, {
      message: "The text is too long. Please keep it under 5000 characters.",
    }),
});

export function ArgumentAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeArgumentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setAnalysisResult(null);
    const result = await handleAnalyzeArgument({ text: values.text });
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Argument Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the text you want to analyze here..."
                        className="min-h-[300px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full" size="lg">
                <Wand2 className="mr-2 h-5 w-5" />
                {loading ? "Analyzing..." : "Analyze Argument"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="lg:mt-0">
         <Card className="h-full flex flex-col prompt-glow">
          <CardContent className="p-6 flex-grow flex flex-col">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <div className="pt-6 space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
                 <div className="pt-6 space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                        <span className="text-2xl mr-2">📊</span> Analysis Summary
                    </h3>
                    <p className="text-muted-foreground">{analysisResult.analysisSummary}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">🎯</span> Overall Strength: {analysisResult.overallStrength}/100
                  </h3>
                  <Progress value={analysisResult.overallStrength} className="w-full" />
                </div>

                {analysisResult.breakdown && analysisResult.breakdown.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                        <span className="text-2xl mr-2">📈</span> Strength Breakdown
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Criterion</TableHead>
                          <TableHead className="text-center">Score</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisResult.breakdown.map((item) => (
                          <TableRow key={item.criterion}>
                            <TableCell className="font-medium">{item.criterion}</TableCell>
                            <TableCell className="text-center">{item.score}/10</TableCell>
                            <TableCell>{item.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">📌</span> Main Claim
                  </h3>
                  <p className="text-muted-foreground bg-secondary/50 p-3 rounded-md border">{analysisResult.mainClaim}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">👍</span> Supporting Points
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    {analysisResult.supportingPoints.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <span className="text-2xl mr-2">👎</span> Weaknesses & Fallacies
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    {analysisResult.weaknesses.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                </div>
                
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full border border-dashed rounded-lg p-8">
                <Bot className="h-12 w-12 mb-4" />
                <p>Your argument analysis will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
