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
import { handleRefinePrompt } from "@/app/generator/actions";
import { Wand2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { PromptOutput } from "../generator/prompt-output";

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
  const [analysisResult, setAnalysisResult] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setAnalysisResult("");
    const result = await handleRefinePrompt({ initialPrompt: values.prompt });
    setLoading(false);

    if (result.success && result.prompt) {
      setAnalysisResult(result.prompt);
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
                {loading ? "Analyzing..." : "Analyze and Enhance"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="lg:mt-0">
         <PromptOutput prompt={analysisResult} isLoading={loading} setPrompt={setAnalysisResult} disableRefine={true} />
      </div>
    </div>
  );
}
