// Static on purpose: Next.js's build-time prerender rejects `new Date()`
// here (it's non-deterministic), and a copyright year doesn't need to be
// computed live. Bump it by hand when it's out of date.
const YEAR = 2026;

export default function Footer() {
  const year = YEAR;
  return (
    <footer className="border-t border-rule py-8">
      <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
        <span>© {year} lexpy.cloud, todos los derechos reservados.</span>
        <span>Desplegado en un VPS propio con Dokploy.</span>
      </div>
    </footer>
  );
}
