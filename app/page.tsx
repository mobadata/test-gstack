import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--inbox-bg)] text-[var(--inbox-text)]">
      <header className="border-b border-[var(--inbox-border)] bg-[var(--inbox-surface)] px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <span className="text-sm font-semibold">gstack-instagram</span>
          <Link
            href="/inbox"
            className="rounded bg-[var(--inbox-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Ouvrir l’inbox
          </Link>
        </div>
      </header>
      <main className="mx-auto flex max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Répondez aux commentaires Instagram sans improvisation publique.
        </h1>
        <p className="text-base leading-relaxed text-[var(--inbox-muted)]">
          Centralisez les commentaires, générez des brouillons (règles + IA), validez chaque réponse avant envoi.
          Cette interface est en construction : l’inbox affiche déjà une maquette fonctionnelle avec données fictives.
        </p>
        <div>
          <Link
            href="/inbox"
            className="inline-flex rounded border border-[var(--inbox-border)] bg-[var(--inbox-surface)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--inbox-row-hover)]"
          >
            Voir la maquette inbox
          </Link>
        </div>
      </main>
    </div>
  );
}
