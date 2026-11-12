import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonLinkProps {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  download?: boolean;
}

export default function ButtonLink({
  href,
  variant = "primary",
  children,
  className,
  external,
  download,
}: ButtonLinkProps) {
  const classes = cn(
    variant === "primary" ? "btn-primary" : "btn-secondary",
    className
  );

  if (external || download) {
    return (
      <a
        href={href}
        className={classes}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        {...(download && { download: true })}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
