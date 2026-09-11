import Link from "next/link";

export function TagPill({ tag }: { tag: string }) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className="inline-flex items-center rounded-full border border-stone-300 bg-stone-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-stone-700 transition hover:border-stone-400 hover:bg-stone-200"
    >
      #{tag}
    </Link>
  );
}
