"use server";

import {
  generateInitialPrompt,
  GenerateInitialPromptInput,
} from "@/ai/flows/generate-initial-prompt";
import {
  refineGeneratedPrompt,
  RefineGeneratedPromptInput,
} from "@/ai/flows/refine-generated-prompt";

export async function handleGeneratePrompt(
  input: GenerateInitialPromptInput
): Promise<{ success: boolean; prompt?: string; error?: string }> {
  try {
    const result = await generateInitialPrompt(input);
    return { success: true, prompt: result.prompt };
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
    return { success: true, prompt: result.refinedPrompt };
  } catch (e: any) {
    console.error("Error refining prompt:", e);
    return { success: false, error: e.message || "Failed to refine prompt. Please try again." };
  }
}
