import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sanitizeHtml } from "@/lib/sanitize";

export function MarkdownView({ content }: { content: string }) {
  const sanitized = sanitizeHtml(content || "");

  return (
    <div className="prose prose-stone max-w-none prose-headings:font-serif prose-p:leading-8 prose-li:leading-7 prose-a:text-stone-700 prose-strong:text-stone-800">
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>{sanitized}</ReactMarkdown>
    </div>
  );
}
