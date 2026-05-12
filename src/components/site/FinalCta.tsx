export function FinalCta() {
  return (
    <section className="py-28 relative">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 sm:p-16 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[140%] bg-gradient-brand opacity-20 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
          <div className="relative">
            <h2 className="text-4xl sm:text-6xl font-semibold tracking-[-0.035em] leading-[1.05]">
              Bring crypto payments
              <br />
              <span className="text-gradient-brand">to the real world.</span>
            </h2>
            <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
              Spin up a merchant terminal in minutes. No hardware, no chain config, no custody headaches.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/dashboard/payment"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-[#0a0a0a] hover:opacity-95 transition"
              >
                Launch POS
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-medium hover:bg-white/5 transition"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
