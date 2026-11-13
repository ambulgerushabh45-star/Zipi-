export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#050b14] text-[#f1f5f9] pt-28 pb-20 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-10 animate-pulse">
        <div className="space-y-4">
          <div className="h-4 w-40 rounded-full bg-[#0b1a2c]" />
          <div className="h-12 w-3/4 max-w-xl rounded-2xl bg-[#0b1a2c]" />
          <div className="h-5 w-2/3 max-w-lg rounded-xl bg-[#08121f]" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-72 rounded-3xl border border-white/10 bg-[#0b1a2c]/60 p-6"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

