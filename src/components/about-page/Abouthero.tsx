"use client";


export const AboutHero = () => (
  <section className="relative h-100 md:h-120 overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center scale-105"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/flagged/photo-1564153296137-400b51e1ff6d?q=80&w=915&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    />
    <div className="absolute inset-0 bg-linear-to-b from-primary-dark/85 via-primary/60 to-ink/80" />

    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
      <span className="inline-block text-accent text-xs font-bold tracking-[0.25em] uppercase mb-4 border border-accent/40 px-4 py-1 rounded-full">
        Kigali Special Economic Zone · Rwanda
      </span>
      <h1 className="text-font text-4xl md:text-5xl font-bold leading-tight mb-4">
        About Kason Motor Ltd
      </h1>
      <p className="text-font/70 text-sm md:text-base uppercase tracking-[0.15em] max-w-lg">
        Driving Rwanda&apos;s Transition to Sustainable, Smart Mobility
      </p>
    </div>
  </section>
);
