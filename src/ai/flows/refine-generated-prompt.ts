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
  refinedPrompt: z.string().describe('The AI-refined prompt.'),
});
export type RefineGeneratedPromptOutput = z.infer<typeof RefineGeneratedPromptOutputSchema>;

export async function refineGeneratedPrompt(input: RefineGeneratedPromptInput): Promise<RefineGeneratedPromptOutput> {
  return refineGeneratedPromptFlow(input);
}

const refinePrompt = ai.definePrompt({
  name: 'refinePrompt',
  input: {schema: RefineGeneratedPromptInputSchema},
  output: {schema: RefineGeneratedPromptOutputSchema},
  prompt: `You are an expert prompt engineer. Your task is to refine the given prompt to make it more effective for large language models.

Original Prompt: {{{initialPrompt}}}

Refined Prompt:`, // Keep it open-ended to allow for creative prompt engineering
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
