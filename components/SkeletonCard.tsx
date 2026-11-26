export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] rounded-2xl bg-flicker-card border border-flicker-border mb-3" />
      <div className="h-3 bg-flicker-card rounded-full mb-2 w-3/4" />
      <div className="h-2 bg-flicker-card rounded-full w-1/2" />
    </div>
  )
}
