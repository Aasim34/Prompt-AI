'use server';

/**
 * @fileOverview This file contains a Genkit flow that refines a generated prompt using an AI model.
 *
 * refineGeneratedPrompt - A function that takes an initial prompt and enhances it using AI.
 * RefineGeneratedPromptInput - The input type for the refineGeneratedPrompt function.
 * RefineGeneratedPromptOutput - The return type for the refineGeneratedPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineGeneratedPromptInputSchema = z.object({
  initialPrompt: z.string().describe('The initial generated prompt to be refined.'),
});
export type RefineGeneratedPromptInput = z.infer<typeof RefineGeneratedPromptInputSchema>;

const RefineGeneratedPromptOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of how strong the prompt is.'),
  score: z.string().describe('The total numeric score (0-100).'),
  clarity: z.string().describe('Clarity and Specificity score (0-25).'),
  completeness: z.string().describe('Completeness and Context score (0-25).'),
  creativity: z.string().describe('Creativity and Originality score (0-25).'),
  goalRelevance: z.string().describe('Goal Relevance and Actionability score (0-25).'),
  weakPoints: z.array(z.string()).describe('A list of missing or weak points.'),
  enhancedPrompt: z.string().describe('The rewritten, enhanced prompt.'),
});

export type RefineGeneratedPromptOutput = z.infer<typeof RefineGeneratedPromptOutputSchema>;

export async function refineGeneratedPrompt(input: RefineGeneratedPromptInput): Promise<RefineGeneratedPromptOutput> {
  return refineGeneratedPromptFlow(input);
}

const refinePrompt = ai.definePrompt({
  name: 'refinePrompt',
  input: {schema: RefineGeneratedPromptInputSchema},
  output: {schema: RefineGeneratedPromptOutputSchema},
  prompt: `You are a professional Prompt Analyzer and Optimizer AI.
Your task is to analyze, score, and improve any prompt that the user provides.

Follow these steps strictly:

1. **Read the user's prompt carefully.**
2. **Provide a detailed analysis** of how strong the prompt is.
3. **Provide numeric scores** based on:
   - Clarity and Specificity (0–25)
   - Completeness and Context (0–25)
   - Creativity and Originality (0–25)
   - Goal Relevance and Actionability (0–25)
4. **List the Missing or Weak Points** — what the user can improve (e.g., lack of detail, unclear goals, missing output format).
5. **Enhance the Prompt** — rewrite it to be more detailed, clear, and effective while keeping the same intent.

Now, analyze this user prompt:

"{{{initialPrompt}}}"`,
});

const refineGeneratedPromptFlow = ai.defineFlow(
  {
    name: 'refineGeneratedPromptFlow',
    inputSchema: RefineGeneratedPromptInputSchema,
    outputSchema: RefineGeneratedPromptOutputSchema,
  },
  async input => {
    const {output} = await refinePrompt(input);
    return output!;
  }
);
