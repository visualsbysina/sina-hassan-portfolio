import Link from "next/link";

export default function NotFound() {
  return (
    <div className="editorial-grid flex min-h-[60vh] flex-col items-start justify-center py-section">
      <p className="label-mono mb-4">404</p>
      <h1 className="heading-serif text-display-md text-ink">Page not found</h1>
      <p className="mt-4 max-w-prose text-[17px] text-ink-muted md:text-lg">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Return Home
      </Link>
    </div>
  );
}
