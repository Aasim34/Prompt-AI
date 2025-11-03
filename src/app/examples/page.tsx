import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

const examples = [
  {
    idea: "A bakery website",
    goal: "Website Prompt",
    prompt: `**Goal:** Generate a comprehensive plan and content outline for a modern, user-friendly website for a local artisan bakery.

**Audience:** Local residents, foodies, and people looking for custom cakes and baked goods for events.

**Tone:** Warm, inviting, and professional.

**Output Format:** A structured document with clear headings for each section.

**Instructions:**
1.  **Homepage:** Design a visually appealing hero section with high-quality images of bread and pastries. Include a clear call-to-action (e.g., "Order Online," "View Our Menu").
2.  **About Us:** Write a short story about the bakery's origins, its passion for baking, and its commitment to quality ingredients.
3.  **Menu:** Create a detailed menu with categories (e.g., Breads, Pastries, Cakes, Beverages). Each item should have a name, a brief description, and a price.
4.  **Online Ordering:** Outline the functionality for an online ordering system, including item selection, customization options, and a secure checkout process.
5.  **Contact Page:** Include the bakery's address, phone number, a contact form, and an embedded map.`,
  },
  {
    idea: "YouTube channel about space",
    goal: "Content Creator Prompt",
    prompt: `**Goal:** Develop a content strategy and a list of 10 video ideas for a new YouTube channel focused on space exploration and astronomy.

**Audience:** Science enthusiasts, students, and anyone curious about the universe.

**Tone:** Educational, engaging, and enthusiastic.

**Output Format:** A list of video titles with a short description for each.

**Instructions:**
1.  **Channel Concept:** Define the channel's unique selling proposition. What makes it different from other space channels?
2.  **Content Pillars:** Identify 3-4 main content categories (e.g., "Cosmic Mysteries," "Latest Discoveries," "Rocket Science Explained").
3.  **Video Ideas (10):**
    *   "What If You Fell Into a Black Hole?"
    *   "The Most Mind-Bending Paradoxes in Physics"
    *   "Could Humans Colonize Mars in Our Lifetime?"
    *   "A Tour of the James Webb Space Telescope's First Images"
    *   "The Search for Alien Life: Where Are They?"
    *   "Explaining Wormholes: Fact vs. Fiction"
    *   "The Incredible Engineering of the Saturn V Rocket"
    *   "Top 5 Most Likely Places to Find Water in Our Solar System"
    *   "A Beginner's Guide to Stargazing"
    *   "The Physics of Star Trek's Warp Drive, Explained"`,
  },
  {
    idea: "Mobile app for notes",
    goal: "App Prompt",
    prompt: `**Goal:** Outline the key features and user interface (UI) design for a new minimalist note-taking mobile app called "Inkdrop".

**Audience:** Students, writers, professionals, and anyone who needs a simple, organized way to capture ideas.

**Tone:** Clean, modern, and user-centric.

**Output Format:** A feature list and UI/UX design specifications.

**Instructions:**
1.  **Core Features:**
    *   **Markdown Support:** Allow users to format notes with headings, bold, italics, lists, etc.
    *   **Folder Organization:** Enable users to create folders and subfolders to categorize notes.
    *   **Tagging System:** Implement a tagging system for cross-referencing notes.
    *   **Cloud Sync:** Automatically sync notes across multiple devices (iOS, Android, Desktop).
    *   **Search:** A powerful search function that can find text within any note.
2.  **UI/UX Design:**
    *   **Home Screen:** A clean list of recent notes and folders.
    *   **Note Editor:** A distraction-free writing environment with a simple formatting toolbar.
    *   **Navigation:** Intuitive navigation using a sidebar or tab bar.
    *   **Theme:** Offer both light and dark mode options.`,
  },
];

export default function ExamplesPage() {
  return (
    <>
      <PageHeader
        title="Example Prompts"
        subtitle="See how simple ideas can be transformed into powerful, structured prompts."
      />
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {examples.map((example, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle>{example.idea}</CardTitle>
                <CardDescription>Goal: {example.goal}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <pre className="whitespace-pre-wrap text-sm font-sans p-4 bg-secondary rounded-md h-full">
                  {example.prompt}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
