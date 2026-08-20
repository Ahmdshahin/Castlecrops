'use client';

import { useState, useTransition } from 'react';
import { updatePassword } from '../actions';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ResetPassword() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updatePassword(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess('Password updated successfully! Redirecting...');
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-black" dir="ltr">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/hero_bg.jpg" 
          alt="Background" 
          fill 
          sizes="100vw"
          priority
          className="object-cover opacity-15 mix-blend-lighten"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"></div>
      </div>

      <div className="w-full max-w-[420px] mx-auto p-10 sm:p-14 bg-black/50 backdrop-blur-3xl border border-gold-dim/30 shadow-[0_0_80px_rgba(212,175,55,0.08),inset_0_0_20px_rgba(212,175,55,0.02)] relative z-10 rounded-2xl group/modal">
        <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-gold/60 -translate-x-1 -translate-y-1"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-gold/60 translate-x-1 translate-y-1"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-gold/20 translate-x-1 -translate-y-1"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-gold/20 -translate-x-1 translate-y-1"></div>
        
        <div className="text-center mb-10 flex flex-col items-center">
          <Image src="/logo_dark.png" alt="Logo" width={80} height={80} className="mb-6 opacity-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] logo-dark-only" priority />
          <Image src="/logo_light.png" alt="Logo" width={80} height={80} className="mb-6 opacity-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] logo-light-only" priority />
          <span className="eyebrow mx-auto tracking-[0.4em] text-gold-bright text-xs">SECURITY</span>
          <h1 className="text-3xl font-serif-latin text-cream mt-2 mb-1 tracking-wide">Choose Password</h1>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border-l-2 border-l-red-500 border-t border-t-red-500/20 border-r border-r-red-500/20 border-b border-b-red-500/20 text-red-400 p-4 mb-8 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="bg-green-500/10 border-l-2 border-l-green-500 border-t border-t-green-500/20 border-r border-r-green-500/20 border-b border-b-green-500/20 text-green-400 p-4 mb-8 text-sm flex items-center justify-center gap-3 animate-in fade-in zoom-in shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <p className="font-semibold text-center">{success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="password" className="text-[11px] uppercase tracking-widest text-gold-dim ml-1">New Password</label>
              <div className="relative">
                <input 
                  required 
                  minLength={6}
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password" 
                  placeholder="••••••••••••"
                  className="w-full bg-black/40 border border-gold-dim/30 focus:border-gold px-4 py-3.5 pr-12 text-cream outline-none transition-all duration-300 placeholder:text-cream-dim/30 hover:border-gold-dim/70 focus:bg-black/60 focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] rounded-2xl tracking-widest"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-dim hover:text-gold transition-colors focus:outline-none hover:scale-110 active:scale-95 duration-200"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 relative mb-2">
              <label htmlFor="confirmPassword" className="text-[11px] uppercase tracking-widest text-gold-dim ml-1">Confirm Password</label>
              <div className="relative">
                <input 
                  required 
                  minLength={6}
                  type={showConfirmPassword ? "text" : "password"} 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  placeholder="••••••••••••"
                  className="w-full bg-black/40 border border-gold-dim/30 focus:border-gold px-4 py-3.5 pr-12 text-cream outline-none transition-all duration-300 placeholder:text-cream-dim/30 hover:border-gold-dim/70 focus:bg-black/60 focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] rounded-2xl tracking-widest"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-dim hover:text-gold transition-colors focus:outline-none hover:scale-110 active:scale-95 duration-200"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isPending}
              className="btn-admin-primary w-full py-4 text-sm uppercase tracking-[0.2em] relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] disabled:opacity-80 disabled:hover:scale-100 disabled:cursor-not-allowed mt-2"
            >
              <span className={`flex items-center justify-center gap-2 transition-transform duration-300 ${isPending ? '-translate-y-12' : 'translate-y-0'}`}>
                Update Password
              </span>
              <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isPending ? 'translate-y-0' : 'translate-y-12'}`}>
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
