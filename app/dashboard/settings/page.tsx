"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, CreditCard, Bell, LogOut, Check, Save } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const tabs = [
   { id: 'profile', icon: User, label: "Profile" },
   { id: 'security', icon: Shield, label: "Security" },
   { id: 'billing', icon: CreditCard, label: "Billing" },
   { id: 'notifications', icon: Bell, label: "Alerts" },
];

export default function SettingsPage() {
   const [activeTab, setActiveTab] = useState('profile');
   const [isSaving, setIsSaving] = useState(false);

   const handleSave = () => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 2000);
   };

   return (
      <div className="min-h-screen bg-fashion-light pl-24 pr-8 py-12 md:pl-32 md:pr-12 md:py-20">
         {/* Header */}
         <div className="mb-20">
            <span className="text-label text-semrush-orange mb-2 block">The Studio</span>
            <h1 className="text-5xl md:text-7xl font-serif italic text-fashion-black tracking-tight">
               Settings
            </h1>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Navigation */}
            <div className="lg:col-span-3 space-y-4">
               {tabs.map((tab) => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`w-full flex items-center gap-4 p-5 transition-all border-l-2 ${activeTab === tab.id ? 'border-semrush-orange bg-white text-black shadow-sm' : 'border-transparent text-fashion-gray hover:text-black hover:pl-6'}`}
                  >
                     <tab.icon className="w-4 h-4" strokeWidth={1.5} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
                  </button>
               ))}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9">
               <AnimatePresence mode="wait">
                  {activeTab === 'profile' && (
                     <motion.section
                        key="profile"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white p-12 shadow-sm space-y-12"
                     >
                        <h3 className="text-xl font-serif italic mb-8 border-b border-black/5 pb-4">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="group">
                              <label className="text-label opacity-40 block mb-2 group-focus-within:opacity-100 transition-opacity">Account Handle</label>
                              <input type="text" placeholder="Creative Director" className="w-full bg-transparent border-b border-black/10 py-3 outline-none font-serif italic text-xl focus:border-black transition-colors" />
                           </div>
                           <div className="group">
                              <label className="text-label opacity-40 block mb-2 group-focus-within:opacity-100 transition-opacity">Intel Delivery (Email)</label>
                              <input type="email" placeholder="agent@rankmost.com" className="w-full bg-transparent border-b border-black/10 py-3 outline-none font-serif italic text-xl focus:border-black transition-colors" />
                           </div>
                        </div>
                        <button
                           onClick={handleSave}
                           className="px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-semrush-orange transition-all flex items-center gap-3"
                        >
                           {isSaving ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                           {isSaving ? "Snapshot Saved" : "Update Dossier"}
                        </button>
                     </motion.section>
                  )}

                  {activeTab === 'security' && (
                     <motion.section
                        key="security"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white p-12 shadow-sm space-y-12"
                     >
                        <h3 className="text-xl font-serif italic mb-8 border-b border-black/5 pb-4">Encryption Protocol</h3>
                        <div className="max-w-md space-y-8">
                           <div className="group">
                              <label className="text-label opacity-40 block mb-2">Current Cipher (Password)</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-transparent border-b border-black/10 py-3 outline-none focus:border-black transition-colors" />
                           </div>
                           <div className="group">
                              <label className="text-label opacity-40 block mb-2">New Sequence</label>
                              <input type="password" placeholder="New Secret..." className="w-full bg-transparent border-b border-black/10 py-3 outline-none focus:border-black transition-colors" />
                           </div>
                        </div>
                        <button className="px-10 py-4 border border-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all">
                           Reset Protocol
                        </button>
                     </motion.section>
                  )}

                  {activeTab === 'billing' && (
                     <motion.section
                        key="billing"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                     >
                        <div className="bg-black text-white p-16 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-semrush-orange/5 blur-[100px] -mr-32 -mt-32" />
                           <span className="text-label text-semrush-orange mb-6 block uppercase tracking-[0.4em]">Active Subscription</span>
                           <h3 className="text-4xl font-serif italic mb-4">Specialist Protocol</h3>
                           <p className="text-2xl font-light opacity-60">$15 / month</p>
                           <div className="mt-12 flex gap-4">
                              <button className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-semrush-orange hover:text-white transition-all">
                                 Manage via Paddle
                              </button>
                              <button className="px-8 py-3 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                 Cancel
                              </button>
                           </div>
                        </div>

                        <div className="bg-white p-12 shadow-sm border border-black/5">
                           <h4 className="text-label opacity-40 mb-8 block font-bold">Transaction History</h4>
                           <div className="space-y-6">
                              {[
                                 { date: 'Feb 11, 2026', id: 'INV-9281', amount: '$15.00' },
                                 { date: 'Jan 11, 2026', id: 'INV-8122', amount: '$15.00' },
                              ].map((inv, i) => (
                                 <div key={i} className="flex justify-between items-center py-4 border-b border-black/5 last:border-0 group cursor-pointer hover:px-4 transition-all">
                                    <div>
                                       <p className="font-serif italic text-lg">{inv.id}</p>
                                       <p className="text-[10px] font-bold text-fashion-gray uppercase tracking-widest">{inv.date}</p>
                                    </div>
                                    <span className="font-bold text-sm">{inv.amount}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </motion.section>
                  )}

                  {activeTab === 'notifications' && (
                     <motion.section
                        key="notifications"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white p-12 shadow-sm space-y-12"
                     >
                        <h3 className="text-xl font-serif italic mb-8 border-b border-black/5 pb-4">Intelligence Alerts</h3>
                        <div className="space-y-8">
                           {[
                              { label: "Daily Position Briefing", desc: "Receive metadata on keyword movements every 24h" },
                              { label: "Security Breach Alerts", desc: "Immediate notification if domain health drops 10%+" },
                              { label: "Competitor Infiltration", desc: "Alerts when a rival captures your primary search real estate" },
                           ].map((alert, i) => (
                              <div key={i} className="flex items-center justify-between group">
                                 <div className="max-w-md">
                                    <h4 className="text-xs font-bold uppercase tracking-widest mb-1">{alert.label}</h4>
                                    <p className="text-sm font-light text-fashion-gray italic">{alert.desc}</p>
                                 </div>
                                 <div className="w-12 h-6 bg-black/5 rounded-full relative p-1 cursor-pointer hover:bg-black/10 transition-colors">
                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm absolute left-1 group-hover:left-7 transition-all duration-300" />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </motion.section>
                  )}
               </AnimatePresence>

               <section className="mt-20 pt-12 border-t border-black/5">
                  <button
                     onClick={() => signOut({ callbackUrl: '/' })}
                     className="flex items-center gap-4 text-fashion-gray hover:text-red-500 transition-colors group"
                  >
                     <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Terminate Session (Sign Out)</span>
                  </button>
               </section>
            </div>
         </div>
      </div>
   );
}
