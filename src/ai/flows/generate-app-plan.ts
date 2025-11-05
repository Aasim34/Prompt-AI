'use server';
/**
 * @fileOverview Generates a detailed architectural plan for a full-stack application based on a user's idea.
 *
 * - generateAppPlan - A function that creates a comprehensive plan for building a web application.
 * - GenerateAppPlanInput - The input type for the generateAppPlan function.
 * - GenerateAppPlanOutput - The return type for the generateAppPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppPlanInputSchema = z.object({
  description: z.string().describe('The user-provided description of the application to be built.'),
});
export type GenerateAppPlanInput = z.infer<typeof GenerateAppPlanInputSchema>;

const DataModelSchema = z.object({
  name: z.string().describe('The name of the data model (e.g., "User", "Post").'),
  properties: z.array(z.string()).describe('A list of properties for the data model (e.g., "id: string", "email: string").'),
});

const PageSchema = z.object({
  name: z.string().describe('The name of the page (e.g., "Home", "Profile").'),
  path: z.string().describe('The URL path for the page (e.g., "/", "/profile").'),
  description: z.string().describe('A brief description of what the page contains or does.'),
});

const GenerateAppPlanOutputSchema = z.object({
  appName: z.string().describe('A creative and fitting name for the application.'),
  tagline: z.string().describe('A short, catchy tagline for the application.'),
  coreFeatures: z.array(z.string()).describe('A list of the main features of the application.'),
  techStack: z.object({
    frontend: z.string().describe('The recommended frontend technology.'),
    backend: z.string().describe('The recommended backend technology.'),
    database: z.string().describe('The recommended database.'),
    authentication: z.string().describe('The recommended authentication provider.'),
  }).describe('The technology stack for the application.'),
  dataModels: z.array(DataModelSchema).describe('The data models required for the application.'),
  pages: z.array(PageSchema).describe('The pages or routes for the application.'),
});
export type GenerateAppPlanOutput = z.infer<typeof GenerateAppPlanOutputSchema>;


export async function generateAppPlan(
  input: GenerateAppPlanInput
): Promise<GenerateAppPlanOutput> {
  return generateAppPlanFlow(input);
}

const generateAppPlanPrompt = ai.definePrompt({
  name: 'generateAppPlanPrompt',
  input: {schema: GenerateAppPlanInputSchema},
  output: {schema: GenerateAppPlanOutputSchema},
  prompt: `You are an expert full-stack software architect. A user has provided a description of an application they want to build. Your task is to generate a comprehensive architectural plan for this application.

**User's App Description:**
"{{{description}}}"

**Instructions:**

1.  **App Name and Tagline:** Come up with a creative name and a short, catchy tagline for the app.
2.  **Core Features:** Identify and list the primary features the application should have based on the user's description.
3.  **Tech Stack:** Define the technology stack. You MUST use the following stack:
    *   **Frontend:** Next.js with React & TypeScript
    *   **Backend:** Next.js Server Actions & Genkit for AI
    *   **Database:** Firebase Firestore
    *   **Authentication:** Firebase Authentication
4.  **Data Models:** Define the necessary data models (schemas) for the database. For each model, list its essential properties and their types.
5.  **Pages/Routes:** Outline the main pages or routes the application will have, including their URL path and a short description.

Structure your entire response strictly according to the output schema. Ensure all fields are populated correctly.`,
});

const generateAppPlanFlow = ai.defineFlow(
  {
    name: 'generateAppPlanFlow',
    inputSchema: GenerateAppPlanInputSchema,
    outputSchema: GenerateAppPlanOutputSchema,
  },
  async input => {
    const {output} = await generateAppPlanPrompt(input);
    return output!;
  }
);
