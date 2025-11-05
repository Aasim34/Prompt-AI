
"use server";

import {
  analyzeArgument,
  AnalyzeArgumentInput,
  AnalyzeArgumentOutput,
} from "@/ai/flows/analyze-argument";
import { addDocumentNonBlocking } from "@/firebase";
import { collection, getFirestore } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { serverTimestamp } from "firebase/firestore";

export async function handleAnalyzeArgument(
  input: AnalyzeArgumentInput,
  userId?: string
): Promise<{ success: boolean; analysis?: AnalyzeArgumentOutput; error?: string }> {
  try {
    const result = await analyzeArgument(input);

    if (userId) {
      const { firestore } = initializeFirebase();
      const analysesCollection = collection(firestore, `users/${userId}/analyses`);
      addDocumentNonBlocking(analysesCollection, {
        ...result,
        textInput: input.text,
        createdAt: serverTimestamp(),
      });
    }

    return { success: true, analysis: result };
  } catch (e: any) {
    console.error("Error analyzing argument:", e);
    return { success: false, error: e.message || "Failed to analyze argument. Please try again." };
  }
}
