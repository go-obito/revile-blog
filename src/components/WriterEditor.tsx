"use client";

import { useMemo, useRef, useState } from "react";
import {
  FiBold,
  FiCode,
  FiImage,
  FiItalic,
  FiLink2,
  FiList,
  FiMessageSquare,
  FiType,
  FiUploadCloud,
} from "react-icons/fi";
import CoverImageUploader from "@/components/CoverImageUploader";

const starterBody = `# The lead starts here

Your story begins with a clear angle, a strong signal, and a short paragraph that gives the reader a reason to keep reading.

- Lead with the most important fact
- Add a second layer of context
- Close with a clear takeaway

> Reporting should make complexity feel human, not overwhelming.`;

export default function WriterEditor() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [body, setBody] = useState(starterBody);
  const [isFocused, setIsFocused] = useState(false);

  const previewHtml = useMemo(() => renderMarkdownPreview(body), [body]);

  const applyFormat = (before: string, after = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end) || "text";
    const nextValue =
      textarea.value.slice(0, start) +
      before +
      selected +
      after +
      textarea.value.slice(end);

    setBody(nextValue);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursorStart = start + before.length;
      const cursorEnd = cursorStart + selected.length;
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const addBlock = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const value = textarea.value;
    const insertion = `${prefix}\n`;
    const nextValue = value.slice(0, start) + insertion + value.slice(start);
    setBody(nextValue);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertion.length, start + insertion.length);
    });
  };

  return (
    <div className="rounded-[30px] border border-blue-100 bg-white/90 shadow-[0_20px_45px_rgba(37,99,235,0.08)] backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Draft mode
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            name="status"
            value="draft"
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            Save draft
          </button>
          <button
            type="submit"
            name="status"
            value="published"
            className="primary-button nav-cta rounded-full px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/20"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap gap-2 border border-slate-200 bg-slate-50 p-2.5">
          <button type="button" onClick={() => applyFormat("**", "**")} className="toolbar-button" aria-label="Bold">
            <FiBold className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => applyFormat("*", "*")} className="toolbar-button" aria-label="Italic">
            <FiItalic className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => applyFormat("[link](https://)")} className="toolbar-button" aria-label="Link">
            <FiLink2 className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => addBlock("# ")} className="toolbar-button" aria-label="Header">
            <FiType className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => addBlock("> ")} className="toolbar-button" aria-label="Quote">
            <FiMessageSquare className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => addBlock("- ")} className="toolbar-button" aria-label="List">
            <FiList className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => addBlock("```\n```\n")} className="toolbar-button" aria-label="Code block">
            <FiCode className="h-4 w-4" />
          </button>
          <button type="button" className="toolbar-button" aria-label="Media">
            <FiImage className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-3">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Headline</label>
              <input
                type="text"
                name="title"
                required
                placeholder="The headline that stops the scroll"
                className="mt-2 w-full border-0 bg-transparent px-1 py-1 text-3xl font-semibold tracking-tight text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-3 shadow-inner shadow-slate-100/60">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Story</span>
                <span className="text-xs text-slate-500">{body.length} chars</span>
              </div>

              <textarea
                ref={textareaRef}
                name="body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={18}
                required
                className="w-full resize-none border-0 bg-transparent px-1 py-1 text-base leading-8 text-slate-800 outline-none placeholder:text-slate-400"
                placeholder="Write your story..."
              />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[24px] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">Story settings</h3>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-blue-700">Live</span>
              </div>

              <div className="mt-4 space-y-4 text-sm text-slate-700">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-600">Slug</span>
                  <input name="slug" placeholder="story-slug" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-400" />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-600">Tags</span>
                  <input name="tags" placeholder="news, politics, analysis" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-400" />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-600">Cover image</span>
                  <CoverImageUploader name="coverImageUrl" placeholder="/uploads/cover.jpg" />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-600">Status</span>
                  <select name="status" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-400">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">Media block</h3>
                <FiUploadCloud className="h-4 w-4 text-slate-500" />
              </div>
              <div className="mt-3 rounded-[18px] border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
                Drag image, video, or code into the canvas
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">Preview</h3>
              <div
                className="prose prose-slate mt-3 max-w-none text-sm leading-7 text-slate-700"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .toolbar-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 2.25rem;
          width: 2.25rem;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          color: rgb(51 65 81);
          transition: all 180ms ease;
        }

        .toolbar-button:hover {
          border-color: rgb(147 197 253);
          color: rgb(29 78 216);
          background: rgb(239 246 255);
        }
      `}</style>
    </div>
  );
}

function renderMarkdownPreview(input: string) {
  const lines = input.split("\n");
  const html: string[] = [];

  let listItems: string[] = [];

  const flushList = () => {
    if (!listItems.length) return;
    html.push(`<ul>${listItems.map((item) => `<li>${item}</li>`).join("")}</ul>`);
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flushList();
      html.push("<div class='h-3'></div>");
      continue;
    }

    if (/^#{1}\s+/.test(line)) {
      flushList();
      html.push(`<h1>${convertInlineMarkdown(line.replace(/^#{1}\s+/, ""))}</h1>`);
      continue;
    }

    if (/^#{2}\s+/.test(line)) {
      flushList();
      html.push(`<h2>${convertInlineMarkdown(line.replace(/^#{2}\s+/, ""))}</h2>`);
      continue;
    }

    if (/^>\s+/.test(line)) {
      flushList();
      html.push(`<blockquote>${convertInlineMarkdown(line.replace(/^>\s+/, ""))}</blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      listItems.push(convertInlineMarkdown(line.replace(/^[-*]\s+/, "")));
      continue;
    }

    flushList();
    html.push(`<p>${convertInlineMarkdown(line)}</p>`);
  }

  flushList();

  return html.join("");
}

function convertInlineMarkdown(content: string) {
  return content
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}
