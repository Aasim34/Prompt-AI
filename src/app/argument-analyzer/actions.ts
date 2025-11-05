
"use server";

import {
  analyzeArgument,
  AnalyzeArgumentInput,
  AnalyzeArgumentOutput,
} from "@/ai/flows/analyze-argument";
import { addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

export async function handleAnalyzeArgument(
  input: AnalyzeArgumentInput,
  userId?: string
): Promise<{ success: boolean; analysis?: AnalyzeArgumentOutput; error?: string }> {
  try {
    const result = await analyzeArgument(input);

    if (userId) {
      // We get the firestore instance on the server here.
      // NOTE: This assumes server-side Firebase initialization is configured.
      const firestore = getFirestore();
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
