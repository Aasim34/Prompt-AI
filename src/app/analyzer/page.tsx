import { PromptAnalyzer } from "@/components/analyzer/prompt-analyzer";
import { PageHeader } from "@/components/shared/page-header";

export default function AnalyzerPage() {
  return (
    <>
      <PageHeader
        title="Prompt Analyzer"
        subtitle="Paste your prompt below to get a detailed analysis, score, and an enhanced version."
      />
      <div className="container pb-16">
        <PromptAnalyzer />
      </div>
    </>
  );
}
