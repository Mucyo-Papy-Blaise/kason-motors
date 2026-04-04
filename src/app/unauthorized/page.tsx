import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-20 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
          Access denied
        </p>
        <h1 className="mt-4 text-3xl font-bold">Admin role required</h1>
        <p className="mt-3 text-sm text-white/65">
          This dashboard is restricted to admin accounts only.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Back home
          </Link>
          <Link
            href="/login"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
