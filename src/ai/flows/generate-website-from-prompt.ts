
'use server';
/**
 * @fileOverview Generates the code for a single-page website from a prompt.
 *
 * - generateWebsiteFromPrompt - A function that creates React component code for a website.
 * - GenerateWebsiteInput - The input type for the generateWebsiteFromPrompt function.
 * - GenerateWebsiteOutput - The return type for the generateWebsiteFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWebsiteInputSchema = z.object({
  prompt: z.string().describe('The user-provided prompt describing the website to generate.'),
});
export type GenerateWebsiteInput = z.infer<typeof GenerateWebsiteInputSchema>;

const GenerateWebsiteOutputSchema = z.object({
  code: z.string().describe('The generated React component code for the single-page website.'),
});
export type GenerateWebsiteOutput = z.infer<typeof GenerateWebsiteOutputSchema>;

export async function generateWebsiteFromPrompt(
  input: GenerateWebsiteInput
): Promise<GenerateWebsiteOutput> {
  return generateWebsiteFlow(input);
}

const generateWebsitePrompt = ai.definePrompt({
  name: 'generateWebsitePrompt',
  input: {schema: GenerateWebsiteInputSchema},
  output: {schema: GenerateWebsiteOutputSchema},
  prompt: `You are an expert web developer who creates beautiful, modern, and responsive single-page websites using React and Tailwind CSS.
Your task is to generate the complete code for a single React component that represents the entire website based on the user's prompt.

**User's Prompt:**
"{{{prompt}}}"

**Instructions & Best Practices:**

1.  **Single Component:** The entire website must be contained within a single exported React functional component. Do not create multiple components or files.
2.  **React & JSX:** Use React with JSX syntax. All elements must be standard HTML tags (div, h1, p, etc.) or SVG for icons. Do not import any external components.
3.  **Styling:** Use Tailwind CSS classes for all styling. Do not use CSS-in-JS, style objects, or `<style>` tags. Ensure the design is modern, clean, and visually appealing.
4.  **Responsiveness:** The layout must be fully responsive and look great on all screen sizes (mobile, tablet, desktop). Use Tailwind's responsive prefixes (e.g., \`md:\`, \`lg:\`).
5.  **Icons:** Use inline SVG for all icons. Do not use an icon library.
6.  **Images:** Use placeholder images from \`https://picsum.photos/\`. For example: \`https://picsum.photos/seed/1/800/600\`.
7.  **Structure:** The generated code should be well-structured and easy to read. Include sections like a hero, features, call-to-action, and a footer.
8.  **No Imports/Exports:** The generated code should not contain any \`import\` or \`export\` statements other than the main component export. It should be a self-contained block of JSX.
9.  **Dependencies:** Assume the project has React and Tailwind CSS installed. Do not add any other dependencies.
10. **Code Only:** The output must be only the raw JSX code for the component. Do not wrap it in markdown code blocks or add any explanations.

**Example Component Structure:**

\`\`\`jsx
export default function WebsiteComponent() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Navigation */}
      <nav>...</nav>
      
      {/* Hero Section */}
      <main>
        <section>...</section>
      </main>

      {/* Footer */}
      <footer>...</footer>
    </div>
  );
}
\`\`\`

Now, generate the complete, self-contained React component code for the user's prompt.`,
});

const generateWebsiteFlow = ai.defineFlow(
  {
    name: 'generateWebsiteFlow',
    inputSchema: GenerateWebsiteInputSchema,
    outputSchema: GenerateWebsiteOutputSchema,
  },
  async input => {
    const {output} = await generateWebsitePrompt(input);
    return output!;
  }
);
