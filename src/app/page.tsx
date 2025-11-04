import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Copy, ListChecks } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              PromptForge AI
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Turn your raw ideas into perfectly structured AI prompts, instantly.
            </p>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Whether you're building a website, designing an app, or planning content, get expert-level prompts ready for ChatGPT, Gemini, Claude, or any AI builder.
            </p>
            <Link href="/generator">
              <Button size="lg">
                Start Creating Prompts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Idea to Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simply type your idea, and our AI will generate a detailed, professional prompt in seconds.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <ListChecks className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Customize Your Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Select your desired output—from website and app designs to business plans and content strategies.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <Copy className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Export Anywhere</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Copy the generated prompt with one click and use it in any AI tool.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
