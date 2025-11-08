
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Bot, Check, Copy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { generateWebsiteFromPrompt, GenerateWebsiteInput, GenerateWebsiteOutput } from '@/ai/flows/generate-website-from-prompt';

const formSchema = z.object({
  prompt: z
    .string()
    .min(20, {
      message: 'Please describe your website idea in at least 20 characters.',
    })
    .max(1000, {
      message: 'Your description is too long. Please keep it under 1000 characters.',
    }),
});

async function handleGenerateWebsite(
  input: GenerateWebsiteInput
): Promise<{ success: boolean; result?: GenerateWebsiteOutput; error?: string }> {
  try {
    const result = await generateWebsiteFromPrompt(input);
    return { success: true, result };
  } catch (e: any) {
    console.error("Error generating website:", e);
    return { success: false, error: e.message || "Failed to generate website. Please try again." };
  }
}

export default function VibePage() {
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setGeneratedCode(null);
    const result = await handleGenerateWebsite({ prompt: values.prompt });
    setLoading(false);

    if (result.success && result.result) {
      setGeneratedCode(result.result.code);
    } else {
      toast({
        title: 'Error Generating Website',
        description: result.error || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  }

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setIsCopied(true);
    toast({ title: 'Copied!', description: 'Website code copied to clipboard.' });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const LoadingState = () => (
    <div className="space-y-4 mt-12">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-32 w-full" />
    </div>
  )

  return (
    <>
      <PageHeader
        title="Vibe Website Generator"
        subtitle="Describe the website you want to build, and let AI generate the complete code for you."
      />
      <div className="container max-w-4xl py-12">
        <div className="space-y-8">
          <Card className="border-primary/20 shadow-lg">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., A modern landing page for a new SaaS product that helps teams manage their projects. It should have a dark theme, a hero section with a signup button, a features section with three cards, and a simple footer."
                            className="min-h-[150px] text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    <Wand2 className="mr-2 h-5 w-5" />
                    {loading ? 'Generating Website...' : 'Generate with Vibe'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {loading && <LoadingState />}

          {generatedCode && (
            <div className="mt-12">
              <Card className="prompt-glow relative">
                <Button variant="ghost" size="icon" onClick={handleCopy} className="absolute top-4 right-4 z-10">
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
                <CardContent className="p-0">
                    <pre className="p-6 bg-secondary/50 rounded-md overflow-x-auto text-sm">
                        <code>{generatedCode}</code>
                    </pre>
                </CardContent>
              </Card>
            </div>
          )}

          {!loading && !generatedCode && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full border border-dashed rounded-lg p-12 mt-8">
                <Bot className="h-12 w-12 mb-4" />
                <p>Your generated website code will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
