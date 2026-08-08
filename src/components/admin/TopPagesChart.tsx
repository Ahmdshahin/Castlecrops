'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type TopPageData = {
  path: string;
  visits: number;
};

interface TopPagesChartProps {
  title: string;
  data: TopPageData[];
}

export const TopPagesChart: React.FC<TopPagesChartProps> = ({ title, data }) => {
  const maxVisits = Math.max(...data.map(d => d.visits), 1);

  return (
    <div className="bg-black-soft border border-gold-dim p-6 rounded-2xl w-full h-full flex flex-col">
      <h3 className="text-cream-dim text-sm uppercase tracking-wider mb-6">{title}</h3>
      <div className="flex-1 flex flex-col justify-center gap-5">
        {data.length === 0 ? (
          <div className="text-cream-dim text-sm text-center">No data available</div>
        ) : (
          data.map((item, index) => {
            const widthPercent = (item.visits / maxVisits) * 100;
            return (
              <div key={index} className="w-full">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-cream text-sm truncate max-w-[70%]">{item.path}</span>
                  <span className="text-gold font-serif-latin text-sm">{item.visits}</span>
                </div>
                <div className="w-full h-2 bg-black-matte border border-gold-dim/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                    className="h-full bg-gold-dim rounded-full"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
