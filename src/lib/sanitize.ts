import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(input: string) {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [
      "a",
      "b",
      "blockquote",
      "br",
      "code",
      "em",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "hr",
      "i",
      "img",
      "li",
      "ol",
      "p",
      "pre",
      "strong",
      "table",
      "tbody",
      "td",
      "th",
      "thead",
      "tr",
      "u",
      "ul",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel"],
    ADD_ATTR: ["target"],
  });
}

export function sanitizePlainText(input: string, maxLength = 2000) {
  const trimmed = String(input ?? "").replace(/\s+/g, " ").trim();
  return trimmed.slice(0, maxLength);
}

export function sanitizeMarkdownBody(input: string) {
  const raw = String(input ?? "");
  return sanitizeHtml(raw).trim();
}
