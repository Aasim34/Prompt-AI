
"use server";

import {
  generateAppPlan,
  GenerateAppPlanInput,
  GenerateAppPlanOutput,
} from "@/ai/flows/generate-app-plan";

export async function handleGenerateAppPlan(
  input: GenerateAppPlanInput
): Promise<{ success: boolean; plan?: GenerateAppPlanOutput; error?: string }> {
  try {
    const result = await generateAppPlan(input);
    return { success: true, plan: result };
  } catch (e: any) {
    console.error("Error generating app plan:", e);
    return { success: false, error: e.message || "Failed to generate app plan. Please try again." };
  }
}
