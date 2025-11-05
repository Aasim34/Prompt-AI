
"use server";

import {
  generateInitialPrompt,
  GenerateInitialPromptInput,
} from "@/ai/flows/generate-initial-prompt";
import {
  refineGeneratedPrompt,
  RefineGeneratedPromptInput,
  RefineGeneratedPromptOutput,
} from "@/ai/flows/refine-generated-prompt";
import { addDocumentNonBlocking } from "@/firebase";
import { getFirebaseAdmin } from "@/firebase/server";
import { collection, serverTimestamp } from "firebase/firestore";


export async function handleGeneratePrompt(
  input: GenerateInitialPromptInput,
  userId?: string
): Promise<{ success: boolean; prompt?: string; error?: string }> {
  try {
    const result = await generateInitialPrompt(input);
    const fullPrompt = `**Goal:** ${input.goalType}\n\n${result.prompt}`;
    
    if (userId) {
      const { firestore } = getFirebaseAdmin();
      const promptsCollection = collection(firestore, `users/${userId}/prompts`);
      addDocumentNonBlocking(promptsCollection, {
        ideaInput: input.idea,
        outputGoal: input.goalType,
        generatedPrompt: result.prompt,
        createdAt: serverTimestamp(),
      });
    }

    return { success: true, prompt: fullPrompt };
  } catch (e: any) {
    console.error("Error generating prompt:", e);
    return { success: false, error: e.message || "Failed to generate prompt. Please try again." };
  }
}

export async function handleRefinePrompt(
  input: RefineGeneratedPromptInput
): Promise<{ success: boolean; prompt?: string; error?: string }> {
  try {
    const result = await refineGeneratedPrompt(input);
    const formattedResponse = `---
🧩 **Prompt Analysis**
${result.analysis}

🎯 **Prompt Score:** ${result.score}/100
• Clarity: ${result.clarity}/25
• Completeness: ${result.completeness}/25
• Creativity: ${result.creativity}/25
• Goal Relevance: ${result.goalRelevance}/25

⚠️ **Missing or Weak Points**
${result.weakPoints.map(p => `- ${p}`).join('\n')}

✨ **Enhanced Prompt**
"${result.enhancedPrompt}"
---`;
    return { success: true, prompt: formattedResponse };
  } catch (e: any) {
    console.error("Error refining prompt:", e);
    return { success: false, error: e.message || "Failed to refine prompt. Please try again." };
  }
}

export async function handleAnalyzePrompt(
  input: RefineGeneratedPromptInput
): Promise<{ success: boolean; analysis?: RefineGeneratedPromptOutput; error?: string }> {
  try {
    const result = await refineGeneratedPrompt(input);
    return { success: true, analysis: result };
  } catch (e: any) {
    console.error("Error analyzing prompt:", e);
    return { success: false, error: e.message || "Failed to analyze prompt. Please try again." };
  }
}
