
"use server";

import {
  analyzeArgument,
  AnalyzeArgumentInput,
  AnalyzeArgumentOutput,
} from "@/ai/flows/analyze-argument";

export async function handleAnalyzeArgument(
  input: AnalyzeArgumentInput
): Promise<{ success: boolean; analysis?: AnalyzeArgumentOutput; error?: string }> {
  try {
    const result = await analyzeArgument(input);
    return { success: true, analysis: result };
  } catch (e: any) {
    console.error("Error analyzing argument:", e);
    return { success: false, error: e.message || "Failed to analyze argument. Please try again." };
  }
}
