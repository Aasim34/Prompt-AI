
import { ArgumentAnalyzer } from "@/components/argument-analyzer/argument-analyzer";
import { PageHeader } from "@/components/shared/page-header";

export default function ArgumentAnalyzerPage() {
  return (
    <>
      <PageHeader
        title="Argument Analyzer"
        subtitle="Paste any text below to analyze its logical structure and argument strength."
      />
      <div className="container pb-16">
        <ArgumentAnalyzer />
      </div>
    </>
  );
}
