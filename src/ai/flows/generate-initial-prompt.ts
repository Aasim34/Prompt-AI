'use server';

/**
 * @fileOverview Generates an initial prompt based on user input and selected goal type.
 *
 * - generateInitialPrompt - A function that generates a detailed and formatted prompt tailored to the user's needs.
 * - GenerateInitialPromptInput - The input type for the generateInitialPrompt function.
 * - GenerateInitialPromptOutput - The return type for the generateInitialPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialPromptInputSchema = z.object({
  idea: z.string().describe('The user-provided idea.'),
  goalType: z.string().describe('The selected goal type (e.g., Website Prompt, App Prompt).'),
});

export type GenerateInitialPromptInput = z.infer<
  typeof GenerateInitialPromptInputSchema
>;

const GenerateInitialPromptOutputSchema = z.object({
  prompt: z.string().describe('The generated prompt.'),
});

export type GenerateInitialPromptOutput = z.infer<
  typeof GenerateInitialPromptOutputSchema
>;

export async function generateInitialPrompt(
  input: GenerateInitialPromptInput
): Promise<GenerateInitialPromptOutput> {
  return generateInitialPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialPromptPrompt',
  input: {schema: GenerateInitialPromptInputSchema},
  output: {schema: GenerateInitialPromptOutputSchema},
  prompt: `I have an idea: {{{idea}}}. Generate a complete, expert-level prompt for this idea covering goal, audience, tone, output format, and step-by-step instructions. The goal type is: {{{goalType}}}.`,
});

const generateInitialPromptFlow = ai.defineFlow(
  {
    name: 'generateInitialPromptFlow',
    inputSchema: GenerateInitialPromptInputSchema,
    outputSchema: GenerateInitialPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
