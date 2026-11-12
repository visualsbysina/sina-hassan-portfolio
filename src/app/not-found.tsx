import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <div className="editorial-grid flex min-h-[80svh] flex-col justify-end pb-20 pt-32">
      <p className="label-mono">
        <span className="text-signal">(404)</span> Page not found
      </p>
      <h1 className="heading-display mt-6 text-mega text-paper">
        Lost in <span className="font-serif font-normal italic tracking-[-0.03em]">orbit.</span>
      </h1>
      <p className="text-body mt-8 max-w-md">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">
          Return home <ArrowRight />
        </Link>
        <Link href="/lab/planet-rounds" className="btn-secondary">
          Blast a planet instead
        </Link>
      </div>
    </div>
  );
}
