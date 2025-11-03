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
  prompt: `You are a professional Prompt Analyzer and Optimizer AI.
Your task is to analyze, score, and improve any prompt that the user provides.

Follow these steps strictly:

1. **Read the user's prompt carefully.**
2. **Give a detailed analysis** of how strong the prompt is.
3. **Provide a numeric score (0–100)** based on:
   - Clarity and Specificity (0–25)
   - Completeness and Context (0–25)
   - Creativity and Originality (0–25)
   - Goal Relevance and Actionability (0–25)
4. **List the Missing or Weak Points** — what the user can improve (e.g., lack of detail, unclear goals, missing output format).
5. **Enhance the Prompt** — rewrite it to be more detailed, clear, and effective while keeping the same intent.
6. **Format your response** like this:

---
🧩 **Prompt Analysis**
{Explain your evaluation briefly}

🎯 **Prompt Score:** {total}/100
• Clarity: {}/25
• Completeness: {}/25
• Creativity: {}/25
• Goal Relevance: {}/25

⚠️ **Missing or Weak Points**
- Point 1
- Point 2
- Point 3

✨ **Enhanced Prompt**
"Your improved prompt goes here..."
---

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
