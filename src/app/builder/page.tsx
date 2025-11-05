
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function BuilderPage() {
  return (
    <>
      <PageHeader
        title="AI App Builder"
        subtitle="Describe the full-stack application you want to build, and let AI do the heavy lifting."
      />
      <div className="container max-w-4xl py-12">
        <div className="space-y-6">
          <Textarea
            placeholder="e.g., A full-stack Typescript application with a React frontend and a Node.js backend. It should be a simple to-do list app with user authentication..."
            className="min-h-[200px] text-base"
          />
          <Button size="lg" className="w-full">
            Build My App
          </Button>
        </div>
      </div>
    </>
  );
}
