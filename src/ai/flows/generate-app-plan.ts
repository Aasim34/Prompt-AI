
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
    setupInstructions: z.array(z.string()).describe("Step-by-step instructions on how to integrate the API, including where to store API keys."),
    securityWarning: z.string().describe("A critical warning about keeping the API key secret and not exposing it on the client-side."),
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
  databaseSetup: z.array(z.string()).optional().describe('Step-by-step instructions for setting up the database if needed, with links to relevant documentation.'),
  authenticationSetup: z.array(z.string()).optional().describe('Step-by-step instructions for setting up authentication if needed, with links to relevant documentation.'),
  apiIntegrations: z.array(ApiIntegrationSchema).optional().describe('A list of suggested third-party API integrations.'),
  deploymentSteps: z.array(z.string()).optional().describe('A checklist of steps for deploying the application, with links to relevant documentation.'),
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
  prompt: `You are an expert full-stack software architect. A user has provided a description of an application they want to build. Your task is to generate a comprehensive, detailed, and step-by-step architectural plan for this application, including Markdown links to relevant documentation.

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
6.  **Backend Setup Analysis (Provide detailed, numbered steps with Markdown links):**
    *   **Analyze the app idea** to determine if it requires a database or user authentication.
    *   If a database is needed, provide a detailed, step-by-step **databaseSetup** guide. Example: "1. [Create a new Firebase project](https://console.firebase.google.com) and [enable Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart).", "2. Define collections such as 'users', 'posts', etc.", "3. Configure [Firestore security rules](https://firebase.google.com/docs/firestore/security/get-started) to ensure proper data access control (e.g., users can only write to their own documents).".
    *   If authentication is needed, provide a detailed, step-by-step **authenticationSetup** guide. Example: "1. [Enable desired authentication providers](https://firebase.google.com/docs/auth/web/start) (e.g., Email/Password, Google) in the Firebase console.", "2. Implement sign-up and sign-in UI components in the Next.js app.", "3. Use the [Firebase Client SDK](https://firebase.google.com/docs/web/setup) to handle user authentication state and protect routes.".
7.  **API Integrations:** Suggest 1-2 potential third-party **apiIntegrations** that would enhance the app. For each one:
    *   Provide the name of the API and a clear reason explaining what it would be used for.
    *   Provide detailed **setupInstructions**. These steps must include:
        1.  "Create a \`.env.local\` file at the root of your project to store the API key securely. This file should be added to your \`.gitignore\`."
        2.  "Add your API key to the \`.env.local\` file, like this: \`YOUR_API_NAME_API_KEY='your_secret_key_here'\`."
        3.  "Access the key in your server-side code (e.g., Next.js Server Actions or API routes) using \`process.env.YOUR_API_NAME_API_KEY\`."
    *   Provide a crucial **securityWarning**: "NEVER expose this API key in your client-side code. The \`.env.local\` file is not included in the browser bundle, keeping your key secret. Always use server-side code to make API calls with this key."

8.  **Deployment Steps (Provide detailed, numbered steps with Markdown links):** Provide a detailed checklist of **deploymentSteps** for getting the app live. Example: "1. Initialize a Git repository and [push the code to a provider like GitHub](https://docs.github.com/en/get-started).", "2. [Connect the repository to a hosting provider](https://vercel.com/docs/getting-started-with-vercel) like Vercel or Firebase App Hosting.", "3. Configure all necessary environment variables (e.g., Firebase credentials, API keys) in the hosting provider's dashboard.", "4. [Deploy the application to production](https://nextjs.org/docs/deployment).", "5. Publish and test [Firestore](https://firebase.google.com/docs/firestore/security/deploy) and [Storage](https://firebase.google.com/docs/storage/security/deploy) security rules.".

Structure your entire response strictly according to the output schema. Ensure all fields are populated correctly with detailed, actionable information.`,
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
