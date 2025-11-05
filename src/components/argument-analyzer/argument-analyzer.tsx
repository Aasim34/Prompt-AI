
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
import { Wand2, Bot, CheckCircle, XCircle, Lightbulb, Users, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { AnalyzeArgumentOutput } from "@/ai/flows/analyze-argument";
import { handleAnalyzeArgument } from "@/app/argument-analyzer/actions";
import { Skeleton } from "../ui/skeleton";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useUser } from "@/firebase";

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
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setAnalysisResult(null);
    const result = await handleAnalyzeArgument({ text: values.text }, user?.uid);
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

  const PersonaCard = ({ evalData }: { evalData: AnalyzeArgumentOutput['personaEvaluations'][0] }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{evalData.persona}</span>
          <Badge variant={evalData.score > 75 ? "default" : evalData.score > 50 ? "secondary" : "destructive"}>
            {evalData.score}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground italic">"{evalData.explanation}"</p>
        <div>
          <h4 className="font-semibold mb-2 flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500" />Strengths</h4>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            {evalData.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 flex items-center"><XCircle className="h-5 w-5 mr-2 text-red-500" />Weaknesses</h4>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            {evalData.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 flex items-center"><Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />Suggestions</h4>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            {evalData.suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
  
  const personaDisplayName = (persona: string) => {
    if (persona.includes('Teacher')) return 'Teacher';
    if (persona.includes('Researcher')) return 'Researcher';
    if (persona.includes('Public Audience')) return 'Audience';
    if (persona.includes('Professional Decision-Maker')) return 'Decision-Maker';
    return persona;
  };

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
                    <span className="text-2xl mr-2">📌</span> Main Claim
                  </h3>
                  <p className="text-muted-foreground bg-secondary/50 p-3 rounded-md border">{analysisResult.mainClaim}</p>
                </div>

                {analysisResult.strengthAnalysis && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                      <Scale className="h-6 w-6 mr-2" /> Argument Strength Score: {analysisResult.strengthAnalysis.overallScore} / 10
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">(Scored purely on logic, clarity, and persuasion — not content morality)</p>
                     <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Criterion</TableHead>
                          <TableHead className="text-center">Score</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisResult.strengthAnalysis.criteria.map((c) => (
                          <TableRow key={c.criterion}>
                            <TableCell className="font-medium">{c.criterion}</TableCell>
                            <TableCell className="text-center">{c.score}/10</TableCell>
                            <TableCell className="text-muted-foreground">{c.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {analysisResult.personaEvaluations && analysisResult.personaEvaluations.length > 0 && (
                 <div>
                    <h3 className="font-semibold text-lg mb-2 pt-4 flex items-center border-t">
                        <Users className="h-6 w-6 mr-2" /> Multi-Persona Evaluation
                    </h3>
                     <div className="mb-2">
                        <p className="font-semibold">Combined Persona Score: {analysisResult.combinedScore}/100</p>
                        <Progress value={analysisResult.combinedScore} className="w-full mt-1" />
                    </div>
                    <Tabs defaultValue={analysisResult.personaEvaluations[0].persona} className="pt-2">
                      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                        {analysisResult.personaEvaluations.map((item) => (
                           <TabsTrigger key={item.persona} value={item.persona} className="text-xs md:text-sm">
                             {personaDisplayName(item.persona)}
                           </TabsTrigger>
                        ))}
                      </TabsList>
                      {analysisResult.personaEvaluations.map((item) => (
                        <TabsContent key={item.persona} value={item.persona} className="mt-4">
                          <PersonaCard evalData={item} />
                        </TabsContent>
                      ))}
                    </Tabs>
                 </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full border border-dashed rounded-lg p-8">
                <Bot className="h-12 w-12 mb-4" />
                <p>Your multi-persona argument analysis will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
