import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[920px] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-6xl font-bold text-accent">404</h1>
      <p className="mb-6 text-sm text-muted">Page not found.</p>
      <Link
        href="/"
        className="rounded-md border border-accent px-4 py-2 text-xs text-accent hover:bg-accent hover:text-bg transition-colors"
      >
        Back to notes
      </Link>
    </div>
  );
}
