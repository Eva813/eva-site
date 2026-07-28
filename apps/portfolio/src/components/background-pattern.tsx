export function BackgroundPattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden dark:block"
    >
      <div className="flow-glow absolute inset-x-0 top-0 h-[60vh]" />
    </div>
  );
}
