import Link from "next/link";

export function BrandLogo({ href = "/" }: { href?: string }) {
  return (
    <Link className="font-headline text-2xl font-extrabold tracking-tight text-primary" href={href}>
      Neighbourly
    </Link>
  );
}
