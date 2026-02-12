export default function WhyVoytica() {
  const items = [
    {
      title: "Comparaison rapide",
      desc: "Prix, horaires, durée et escales — tout au même endroit pour décider vite.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          <path
            fill="currentColor"
            d="M4 5h16v2H4V5Zm0 6h10v2H4v-2Zm0 6h16v2H4v-2Zm12-6l4-3v6l-4-3Z"
          />
        </svg>
      ),
    },
    {
      title: "Choix plus malin",
      desc: "On met en avant le meilleur compromis, pas juste le moins cher.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2l2.6 6.7L22 9.3l-5 4.4L18.4 21 12 17.6 5.6 21 7 13.7 2 9.3l7.4-.6L12 2Z"
          />
        </svg>
      ),
    },
    {
      title: "Alerte bons plans",
      desc: "Recevez des deals et inspirations par email, sans spam et sans prise de tête.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20 8V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v1l8 5 8-5Zm0 3.2l-7.4 4.6a1.2 1.2 0 0 1-1.2 0L4 11.2V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5.8Z"
          />
        </svg>
      ),
    },
  ] as const;

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Pourquoi Voytica
          </h2>
          <p className="mt-2 text-slate-600">
            Une expérience simple, rapide et faite pour décider sans stress.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((it) => (
          <div
            key={it.title}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 hover:shadow-lg transition"
          >
            {/* subtle background glow */}
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition" />
            <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl opacity-0 group-hover:opacity-100 transition" />

            <div className="relative flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                {it.icon}
              </div>

              <div className="min-w-0">
                <p className="text-lg font-extrabold text-slate-900">
                  {it.title}
                </p>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  {it.desc}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-700">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 border border-blue-200">
                    ✓
                  </span>
                  <span>Optimisé pour aller à l’essentiel</span>
                </div>
              </div>
            </div>

            {/* bottom line */}
            <div className="relative mt-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}