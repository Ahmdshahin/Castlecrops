'use client';

import { motion } from 'framer-motion';

export const SealDivider = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex items-center justify-center gap-4 py-16 ${className || ''}`}
    >
      <div className="h-px w-full max-w-[180px] bg-gradient-to-r from-transparent to-gold" />
      
      <svg viewBox="0 0 60 60" className="w-[46px] h-[46px] shrink-0">
        <circle cx="30" cy="30" r="27" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-gold" />
        <path d="M30 14 L34 26 L30 22 L26 26 Z" fill="currentColor" className="text-gold" />
        <path d="M14 40 Q30 30 46 40" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-gold" />
      </svg>
      
      <div className="h-px w-full max-w-[180px] bg-gradient-to-l from-transparent to-gold" />
    </motion.div>
  );
};
