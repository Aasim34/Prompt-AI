import { PageHeader } from "@/components/shared/page-header";
import { CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About PromptForge AI"
        subtitle="Empowering creators by simplifying the art of the perfect prompt."
      />
      <div className="container max-w-4xl py-12">
        <div className="prose dark:prose-invert lg:prose-xl mx-auto">
          <h2>Our Mission</h2>
          <p>
            In the age of artificial intelligence, the quality of your output is determined by the quality of your input. A well-crafted prompt is the difference between a generic, uninspired result and a brilliant, tailored creation. Yet, mastering the art of prompt engineering can be a daunting task.
          </p>
          <p>
            PromptForge AI was born from a simple idea: what if anyone could generate expert-level AI prompts for any idea, instantly? Our mission is to bridge the gap between human creativity and AI capability, making powerful tools accessible to everyone, regardless of their technical expertise.
          </p>
          
          <h2>What We Solve</h2>
          <p>
            We help you overcome the "blank page" problem when interacting with AI. Instead of struggling to find the right words, you can focus on your vision. We provide the structure, so you can provide the spark.
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
              <span>
                <strong>For Developers & Builders:</strong> Get detailed feature lists, user flows, and technical specifications for your next website or app.
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
              <span>
                <strong>For Content Creators:</strong> Generate content strategies, video ideas, blog post outlines, and social media campaigns in minutes.
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
              <span>
                <strong>For Entrepreneurs:</strong> Brainstorm business ideas, create marketing plans, and draft professional documents with ease.
              </span>
            </li>
          </ul>

          <p>
            Join us on our journey to make AI a more intuitive and powerful partner for human creativity.
          </p>
        </div>
      </div>
    </>
  );
}
