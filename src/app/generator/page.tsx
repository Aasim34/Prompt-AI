import { PromptGenerator } from "@/components/generator/prompt-generator";
import { PageHeader } from "@/components/shared/page-header";

export default function GeneratorPage() {
  return (
    <>
      <PageHeader
        title="Prompt Generator"
        subtitle="Describe your idea and select a goal. We'll craft a detailed prompt for you."
      />
      <div className="container pb-16">
        <PromptGenerator />
      </div>
    </>
  );
}
