export function Logo({ size = 32, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--royal)] to-[var(--navy-deep)] shadow-cinematic"
        style={{ width: size, height: size }}
      >
        <span className="font-display font-black text-white tracking-tighter" style={{ fontSize: size * 0.42 }}>
          F<span className="text-gradient-orange">A</span>M
        </span>
        <span className="absolute -bottom-0.5 left-1/2 h-[2px] w-[60%] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[var(--orange-accent)] to-transparent" />
      </div>
      {withText && (
        <div className="leading-none">
          <div className="text-[11px] font-semibold tracking-[0.18em] text-[var(--orange-accent)]">FAM</div>
          <div className="text-[12px] font-bold tracking-tight">Академия Морева</div>
        </div>
      )}
    </div>
  );
}
