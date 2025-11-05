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

const ApiIntegrationSchema = z.object({
    name: z.string().describe("The name of the suggested third-party API (e.g., 'Stripe', 'Google Maps')."),
    reason: z.string().describe("The reason why this API is recommended for the app."),
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
  databaseSetup: z.array(z.string()).optional().describe('Step-by-step instructions for setting up the database if needed.'),
  authenticationSetup: z.array(z.string()).optional().describe('Step-by-step instructions for setting up authentication if needed.'),
  apiIntegrations: z.array(ApiIntegrationSchema).optional().describe('A list of suggested third-party API integrations.'),
  deploymentSteps: z.array(z.string()).optional().describe('A checklist of steps for deploying the application.'),
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
3.  **Tech Stack:** You MUST use the following stack:
    *   **Frontend:** Next.js with React & TypeScript
    *   **Backend:** Next.js Server Actions & Genkit for AI
    *   **Database:** Firebase Firestore
    *   **Authentication:** Firebase Authentication
4.  **Data Models:** Define the necessary data models (schemas) for the database. For each model, list its essential properties and their types.
5.  **Pages/Routes:** Outline the main pages or routes the application will have, including their URL path and a short description.
6.  **Backend Setup Analysis:**
    *   **Analyze the app idea** to determine if it requires a database (e.g., for storing user data, content) or user authentication (e.g., for user accounts, profiles).
    *   If a database is needed, provide high-level **databaseSetup** steps. Example: "1. Create a new Firebase project.", "2. Enable Firestore in the Firebase console.", "3. Define security rules for data access." Do not write code.
    *   If authentication is needed, provide high-level **authenticationSetup** steps. Example: "1. Enable an auth provider (e.g., Google, Email/Password) in Firebase.", "2. Implement the login UI component.", "3. Use Firebase SDK to handle user sign-in and sign-out." Do not write code.
7.  **API Integrations:** Suggest 1-2 potential third-party **apiIntegrations** that would enhance the app, and provide a brief reason for each. If none are obvious, you can omit this.
8.  **Deployment Steps:** Provide a short checklist of **deploymentSteps** for getting the app live. Example: "1. Connect GitHub repository.", "2. Set up environment variables.", "3. Deploy to a hosting provider like Firebase App Hosting or Vercel."

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
