"use client";

import { motion } from 'framer-motion';
import { Search, ArrowUp, ArrowDown, Minus, RefreshCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RankingsPage() {
   const [keywords, setKeywords] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [search, setSearch] = useState("");

   useEffect(() => {
      fetchRankings();
   }, []);

   const fetchRankings = async () => {
      setIsLoading(true);
      try {
         const res = await fetch('/api/rankings');
         const result = await res.json();
         if (result.success) {
            setKeywords(result.data.keywords);
         }
      } catch (err) {
         console.error("Failed to fetch rankings:", err);
      } finally {
         setIsLoading(false);
      }
   };

   const filteredKeywords = keywords.filter(k =>
      k.keyword.toLowerCase().includes(search.toLowerCase())
   );

   return (
      <div className="min-h-screen bg-fashion-light pl-24 pr-8 py-12 md:pl-32 md:pr-12 md:py-20">

         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-black/5 pb-8 gap-8">
            <div>
               <span className="text-label text-semrush-orange">Position Tracking</span>
               <h1 className="text-5xl md:text-6xl font-serif italic mt-4 text-fashion-black">
                  Search Performance
               </h1>
            </div>

            <div className="flex items-center gap-6">
               <button
                  onClick={fetchRankings}
                  className="p-2 border border-black/10 hover:border-black transition-colors rounded-full"
               >
                  <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
               </button>
               {/* Minimalist Search */}
               <div className="relative group">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-fashion-gray group-hover:text-black transition-colors" />
                  <input
                     type="text"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     placeholder="Filter Keywords..."
                     className="bg-transparent border-b border-black/10 py-2 pl-8 outline-none font-serif italic placeholder:text-fashion-gray w-64 group-hover:border-black transition-colors"
                  />
               </div>
            </div>
         </div>

         {/* Rankings 'Spec Sheet' */}
         <div className="bg-white shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 ctx-header py-6 px-12 border-b border-black/5 text-[10px] font-bold uppercase tracking-widest text-fashion-gray">
               <div className="col-span-6 md:col-span-4">Keyword Inquiry</div>
               <div className="col-span-3 md:col-span-2 text-center">Position</div>
               <div className="hidden md:block md:col-span-2 text-center">Volume</div>
               <div className="hidden md:block md:col-span-2 text-center">Difficulty</div>
               <div className="col-span-3 md:col-span-2 text-center">Trend</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-black/5">
               {isLoading ? (
                  [1, 2, 3].map(i => (
                     <div key={i} className="animate-pulse grid grid-cols-12 gap-4 py-8 px-12">
                        <div className="col-span-4 h-6 bg-black/5" />
                        <div className="col-span-2 h-6 bg-black/5" />
                        <div className="col-span-2 h-6 bg-black/5" />
                        <div className="col-span-2 h-6 bg-black/5" />
                        <div className="col-span-2 h-6 bg-black/5" />
                     </div>
                  ))
               ) : filteredKeywords.length === 0 ? (
                  <div className="py-20 text-center opacity-40 font-serif italic">
                     No performance data captured for this query.
                  </div>
               ) : (
                  filteredKeywords.map((item, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="grid grid-cols-12 gap-4 py-8 px-12 group hover:bg-black/5 transition-colors cursor-pointer items-center"
                     >
                        <div className="col-span-6 md:col-span-4 font-serif text-xl italic text-fashion-black group-hover:text-semrush-orange transition-colors">
                           {item.keyword}
                        </div>

                        <div className="col-span-3 md:col-span-2 flex justify-center items-center">
                           <span className={`text-2xl font-bold ${item.current_position <= 3 ? 'text-semrush-orange' : 'text-black'}`}>
                              {item.current_position}
                           </span>
                        </div>

                        <div className="hidden md:block md:col-span-2 text-center text-sm font-light text-fashion-gray">
                           {item.volume || '—'}
                        </div>

                        <div className="hidden md:block md:col-span-2 flex justify-center">
                           <span className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest border ${item.diff === 'Hard' ? 'border-red-200 text-red-400' :
                                 item.diff === 'Med' ? 'border-yellow-200 text-yellow-600' :
                                    'border-green-200 text-green-600'
                              }`}>
                              {item.diff || 'Med'}
                           </span>
                        </div>

                        <div className="col-span-3 md:col-span-2 flex justify-center items-center gap-2">
                           {item.trend === 'up' && <ArrowUp className="w-4 h-4 text-green-500" />}
                           {item.trend === 'down' && <ArrowDown className="w-4 h-4 text-red-500" />}
                           {item.trend === 'stable' && <Minus className="w-4 h-4 text-fashion-gray" />}
                           <span className={`text-[10px] font-bold ${item.change > 0 ? 'text-green-500' : item.change < 0 ? 'text-red-500' : ''}`}>
                              {item.change !== 0 ? Math.abs(item.change) : ''}
                           </span>
                        </div>
                     </motion.div>
                  ))
               )}
            </div>
         </div>
      </div>
   );
}
