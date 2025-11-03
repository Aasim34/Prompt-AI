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
  prompt: `I have an idea: {{{idea}}}.
Generate a complete, expert-level prompt for this idea covering goal, audience, tone, output format, and step-by-step instructions. The goal type is: {{{goalType}}}.

After generating the instructions, analyze if the idea requires a database (e.g., for storing user data, content) or user authentication (e.g., for user accounts, profiles).

If it does, add a new section at the end called "**Backend Setup**". In this section, provide simple, high-level steps for what a developer would need to do to connect to Firebase for authentication and Firestore for the database. Do not write code. For example:
1. Set up a new Firebase project in the Firebase console.
2. Enable Firestore and Firebase Authentication.
3. Configure the Firebase SDK in the application.
4. Implement sign-up and login functions for users.
5. Create Firestore data structures to store application data.`,
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
