'use server';
/**
 * @fileOverview Analyzes the logical strength of a given text argument from multiple personas.
 *
 * - analyzeArgument - A function that evaluates an argument and provides a detailed breakdown of its structure and validity from different perspectives.
 * - AnalyzeArgumentInput - The input type for the analyzeArgument function.
 * - AnalyzeArgumentOutput - The return type for the analyzeArgument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeArgumentInputSchema = z.object({
  text: z.string().describe('The text containing the argument to be analyzed.'),
});
export type AnalyzeArgumentInput = z.infer<typeof AnalyzeArgumentInputSchema>;

const PersonaAnalysisSchema = z.object({
  persona: z.string().describe("The name of the persona (e.g., 'Teacher / Educator')."),
  score: z.number().min(0).max(100).describe('The score for this persona, out of 100.'),
  explanation: z.string().describe('A short explanation for the score given by this persona.'),
  strengths: z.array(z.string()).describe('A list of strengths from this persona\'s viewpoint.'),
  weaknesses: z.array(z.string()).describe('A list of weaknesses from this persona\'s viewpoint.'),
  suggestions: z.array(z.string()).describe('A list of suggested improvements based on this persona\'s evaluation style.'),
});

const AnalyzeArgumentOutputSchema = z.object({
  mainClaim: z.string().describe('The primary claim or thesis of the argument.'),
  combinedScore: z.number().min(0).max(100).describe('The final, combined score from all personas.'),
  personaEvaluations: z.array(PersonaAnalysisSchema).describe("A detailed breakdown of the argument's score from four different personas."),
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
  prompt: `You are an expert in multi-perspective critical analysis. Your task is to analyze the following text and evaluate the strength of its argument from four distinct personas.

**Argument Text:**
"{{{text}}}"

**Instructions:**

1.  **Identify the Main Claim:** First, determine the single primary claim or thesis of the argument.

2.  **Multi-Persona Evaluation:** Evaluate the argument from each of the following four personas. For each persona, you must:
    a.  Assign an individual score out of 100.
    b.  Provide a short explanation for the score.
    c.  Highlight specific strengths and weaknesses from that persona's viewpoint.
    d.  Suggest actionable improvements tailored to that persona's focus.

    **Persona 1: Teacher / Educator**
    *   **Focus:** Clarity, structure, explanation depth, and learning value.
    *   **Evaluation:** Is the argument easy to understand? Is it well-organized? Does it teach the reader something valuable?

    **Persona 2: Researcher / Analyst**
    *   **Focus:** Evidence strength, data accuracy, logical rigor, and critical reasoning.
    *   **Evaluation:** Is the evidence credible and properly used? Is the logic sound? Are there any fallacies?

    **Persona 3: Public Audience / Citizen**
    *   **Focus:** Simplicity, relatability, real-world impact, and emotional appeal.
    *   **Evaluation:** Is the argument engaging and easy for a non-expert to grasp? Does it connect to real-world concerns?

    **Persona 4: Professional Decision-Maker (e.g., Manager, Policy Officer)**
    *   **Focus:** Practicality, feasibility, potential consequences, and ethical considerations.
    *   **Evaluation:** Is the argument actionable? What are the risks and benefits of the proposed idea?

3.  **Calculate Combined Score:** Calculate a final "combinedScore" by averaging the scores from the four personas.

4.  **Format the Output:** Structure your response strictly according to the output schema. Ensure there are exactly four evaluations in the 'personaEvaluations' array.`,
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
