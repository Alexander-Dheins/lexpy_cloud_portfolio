// Static on purpose: Next.js's build-time prerender rejects `new Date()`
// here (it's non-deterministic), and a copyright year doesn't need to be
// computed live. Bump it by hand when it's out of date.
const YEAR = 2026;

export default function Footer() {
  const year = YEAR;
  return (
    <footer className="border-t border-foreground/10 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-xs text-muted sm:flex-row">
        <span>© {year} lexpy.cloud — todos los derechos reservados.</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-sm bg-foreground" />
          <span className="h-1.5 w-1.5 rounded-sm bg-accent-red" />
          <span className="h-1.5 w-1.5 rounded-sm bg-accent-blue" />
        </span>
      </div>
    </footer>
  );
}
