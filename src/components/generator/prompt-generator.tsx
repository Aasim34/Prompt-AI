
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { handleGeneratePrompt } from "@/app/generator/actions";
import { PromptOutput } from "./prompt-output";
import { Wand2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useFirestore, useUser } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const formSchema = z.object({
  idea: z
    .string()
    .min(10, {
      message: "Please describe your idea in at least 10 characters.",
    })
    .max(500, {
      message: "Your idea is too long. Please keep it under 500 characters.",
    }),
  goalType: z.string({
    required_error: "Please select a goal type.",
  }),
});

const goalTypes = [
  "Website Prompt",
  "App Prompt",
  "Business Idea Prompt",
  "Content Creator Prompt",
  "AI Agent Prompt",
  "Image Generation Prompt",
];

export function PromptGenerator() {
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idea: "",
      goalType: "Website Prompt",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setGeneratedPrompt("");
    const result = await handleGeneratePrompt(values);
    setLoading(false);

    if (result.success && result.prompt) {
      setGeneratedPrompt(result.prompt);
      if (user && firestore) {
        try {
          const promptsCollection = collection(firestore, `users/${user.uid}/prompts`);
          await addDoc(promptsCollection, {
            ideaInput: values.idea,
            outputGoal: values.goalType,
            generatedPrompt: result.prompt,
            createdAt: serverTimestamp(),
          });
        } catch (e) {
          console.error("Failed to save prompt to Firestore:", e);
          toast({
            title: "Save Failed",
            description: "Your prompt was generated but could not be saved to your history.",
            variant: "destructive",
          });
        }
      }
    } else {
      toast({
        title: "Error",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="idea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Your Idea</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'A mobile app for tracking personal reading habits and sharing book recommendations with friends.'"
                        className="min-h-[150px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goalType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Select a Goal</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a goal for your prompt" />
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        {goalTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full" size="lg">
                <Wand2 className="mr-2 h-5 w-5" />
                {loading ? "Generating..." : "Generate Prompt"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="lg:mt-0">
         <PromptOutput prompt={generatedPrompt} isLoading={loading} setPrompt={setGeneratedPrompt} />
      </div>
    </div>
  );
}
