// Shown by Next.js while a page's Server Component is still reading its data
export default function Loading() {
  return (
    <p
      role="status"
      className="mb-5 pt-10 font-mono text-[0.8125rem] leading-normal tracking-wide text-smoke"
    >
      Loading…
    </p>
  );
}
