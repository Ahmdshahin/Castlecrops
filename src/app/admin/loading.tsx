import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[500px]">
      <div className="relative">
        <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full"></div>
        <Loader2 className="w-12 h-12 text-gold animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-cream-dim font-serif-latin text-lg animate-pulse tracking-wider">
        Loading...
      </p>
    </div>
  );
}
