'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type BarChartData = {
  label: string;
  value: number;
};

interface VisitsBarChartProps {
  title: string;
  data: BarChartData[];
}

export const VisitsBarChart: React.FC<VisitsBarChartProps> = ({ title, data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

  return (
    <div className="bg-black-soft border border-gold-dim p-6 rounded-2xl w-full">
      <h3 className="text-cream-dim text-sm uppercase tracking-wider mb-6">{title}</h3>
      <div className="relative w-full flex items-end justify-between h-[200px] gap-2 pt-8">
        
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-[28px] opacity-10">
          <div className="w-full border-t border-cream-dim"></div>
          <div className="w-full border-t border-cream-dim"></div>
          <div className="w-full border-t border-cream-dim"></div>
          <div className="w-full border-t border-cream-dim"></div>
        </div>

        {data.map((item, index) => {
          const heightPercent = (item.value / maxValue) * 100;
          return (
            <div key={index} className="relative flex flex-col items-center justify-end w-full group h-full">
              {/* Tooltip */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black-matte border border-gold-dim text-gold text-xs py-1 px-2 rounded pointer-events-none z-10 whitespace-nowrap rounded-2xl">
                {item.value} Visits
              </div>
              
              {/* Bar */}
              <div className="w-full max-w-[40px] flex-1 flex items-end mb-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                  className="w-full bg-gold/80 hover:bg-gold-bright transition-colors rounded-t-sm"
                />
              </div>
              
              {/* Label */}
              <div className="text-[10px] sm:text-xs text-cream-dim font-medium h-[20px] truncate w-full text-center">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
