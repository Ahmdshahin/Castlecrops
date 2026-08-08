export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-[120px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gold-dim border-t-gold rounded-full animate-spin"></div>
        <p className="text-cream-dim font-serif-latin animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
