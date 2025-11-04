
'use server';
/**
 * @fileOverview Analyzes the logical strength of a given text argument.
 *
 * - analyzeArgument - A function that evaluates an argument and provides a detailed breakdown of its structure and validity.
 * - AnalyzeArgumentInput - The input type for the analyzeArgument function.
 * - AnalyzeArgumentOutput - The return type for the analyzeArgument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeArgumentInputSchema = z.object({
  text: z.string().describe('The text containing the argument to be analyzed.'),
});
export type AnalyzeArgumentInput = z.infer<typeof AnalyzeArgumentInputSchema>;

export const AnalyzeArgumentOutputSchema = z.object({
  analysisSummary: z
    .string()
    .describe('A brief, high-level summary of the argument analysis.'),
  overallStrength: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A numeric score from 0 to 100 representing the overall strength of the argument.'
    ),
  mainClaim: z
    .string()
    .describe('The primary claim or thesis of the argument.'),
  supportingPoints: z
    .array(z.string())
    .describe(
      'A list of the main supporting points, premises, or evidence provided.'
    ),
  weaknesses: z
    .array(z.string())
    .describe(
      'A list of identified logical fallacies, weak points, or unsupported claims.'
    ),
});
export type AnalyzeArgumentOutput = z.infer<typeof AnalyzeArgumentOutputSchema>;

export async function analyzeArgument(
  input: AnalyzeArgumentInput
): Promise<AnalyzeArgumentOutput> {
  return analyzeArgumentFlow(input);
}

const analyzeArgumentPrompt = ai.definePrompt({
  name: 'analyzeArgumentPrompt',
  input: {schema: AnalyzeArgumentInputSchema},
  output: {schema: AnalyzeArgumentOutputSchema},
  prompt: `You are an expert in logic, rhetoric, and critical thinking. Your task is to analyze the following text and evaluate the strength of its argument.

Follow these steps:
1.  **Identify the Main Claim:** What is the single most important point the author is trying to make?
2.  **List the Supporting Points:** Identify all the premises, evidence, and reasons the author provides to support the main claim.
3.  **Identify Weaknesses & Fallacies:** Scrutinize the argument for any logical fallacies (e.g., ad hominem, straw man, false dilemma), unsupported claims, or weak evidence.
4.  **Score the Argument:** Based on your analysis, provide an "overallStrength" score from 0 (very weak, fallacious) to 100 (very strong, well-supported, logical).
5.  **Summarize Your Analysis:** Write a brief summary of your findings.

Analyze the following text:

"{{{text}}}"`,
});

const analyzeArgumentFlow = ai.defineFlow(
  {
    name: 'analyzeArgumentFlow',
    inputSchema: AnalyzeArgumentInputSchema,
    outputSchema: AnalyzeArgumentOutputSchema,
  },
  async input => {
    const {output} = await analyzeArgumentPrompt(input);
    return output!;
  }
);
