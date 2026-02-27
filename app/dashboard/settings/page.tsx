"use client";

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, CreditCard, Bell, Save, Check, LogOut } from 'lucide-react';
import { useNotification } from '@/components/ui/Notification';

const tabs = [
   { id: 'profile', icon: User, label: "Profile" },
   { id: 'security', icon: Shield, label: "Security" },
   { id: 'billing', icon: CreditCard, label: "Billing" },
   { id: 'notifications', icon: Bell, label: "Alerts" },
];

export default function SettingsPage() {
   const { data: session, update } = useSession();
   const { showNotification } = useNotification();
   const [activeTab, setActiveTab] = useState('profile');
   const [isSaving, setIsSaving] = useState(false);

   const [formData, setFormData] = useState({
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      notifDailyBrief: true,
      notifSecurity: true,
      notifCompetitors: true
   });

   interface Transaction {
      id: string;
      date: string;
      amount: string;
      status: string;
   }

   interface BillingData {
      hasSubscription: boolean;
      planName: string;
      amount: string;
      nextBillingDate: string | null;
      subscriptionId: string | null;
      transactions?: Transaction[];
   }

   const [billingData, setBillingData] = useState<BillingData | null>(null);

   const [isLoadingBilling, setIsLoadingBilling] = useState(false);

   useEffect(() => {
      if (session?.user) {
         setFormData(prev => ({
            ...prev,
            name: session.user?.name || '',
            email: session.user?.email || '',
            notifDailyBrief: (session.user as any).notifDailyBrief ?? true,
            notifSecurity: (session.user as any).notifSecurity ?? true,
            notifCompetitors: (session.user as any).notifCompetitors ?? true
         }));
      }
   }, [session]);

   useEffect(() => {
      if (activeTab === 'billing' && !billingData) {
         fetchBilling();
      }
   }, [activeTab]);

   const fetchBilling = async () => {
      setIsLoadingBilling(true);
      try {
         const res = await fetch('/api/user/billing');
         const data = await res.json();
         if (data.success) {
            setBillingData(data.billing);
         }
      } catch (err) {
         console.error("Failed to fetch billing:", err);
      } finally {
         setIsLoadingBilling(false);
      }
   };

   const handleSave = async () => {
      setIsSaving(true);
      try {
         const res = await fetch('/api/user/settings', {
            method: 'POST',
            body: JSON.stringify(formData)
         });
         const data = await res.json();
         if (data.success) {
            showNotification("Profile updated successfully", "success");
            // Important: sync the local session state with the new values
            await update({
               ...session,
               user: {
                  ...session?.user,
                  name: formData.name,
                  email: formData.email,
                  notifDailyBrief: formData.notifDailyBrief,
                  notifSecurity: formData.notifSecurity,
                  notifCompetitors: formData.notifCompetitors,
               }
            });
         } else {
            showNotification(data.error || "Update failed", "error");
         }
      } catch (err) {
         showNotification("An error occurred during update", "error");
      } finally {
         setIsSaving(false);
      }
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
                              <input
                                 type="text"
                                 value={formData.name}
                                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                 placeholder="Creative Director"
                                 className="w-full bg-transparent border-b border-black/10 py-3 outline-none font-serif italic text-xl focus:border-black transition-colors"
                              />
                           </div>
                           <div className="group">
                              <label className="text-label opacity-40 block mb-2 group-focus-within:opacity-100 transition-opacity">Intel Delivery (Email)</label>
                              <input
                                 type="email"
                                 value={formData.email}
                                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                 placeholder="agent@exricx.com"
                                 className="w-full bg-transparent border-b border-black/10 py-3 outline-none font-serif italic text-xl focus:border-black transition-colors"
                              />
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
                              <input
                                 type="password"
                                 value={formData.currentPassword}
                                 onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                 placeholder="••••••••"
                                 className="w-full bg-transparent border-b border-black/10 py-3 outline-none focus:border-black transition-colors"
                              />
                           </div>
                           <div className="group">
                              <label className="text-label opacity-40 block mb-2">New Sequence</label>
                              <input
                                 type="password"
                                 value={formData.newPassword}
                                 onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                 placeholder="New Secret..."
                                 className="w-full bg-transparent border-b border-black/10 py-3 outline-none focus:border-black transition-colors"
                              />
                           </div>
                        </div>
                        <button
                           onClick={handleSave}
                           disabled={!formData.newPassword || !formData.currentPassword}
                           className="px-10 py-4 border border-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {isSaving ? "Locking Protocol..." : "Reset Protocol"}
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
                           <span className="text-label text-semrush-orange mb-6 block uppercase tracking-[0.4em]">
                              {isLoadingBilling ? "Syncing Intel..." : (billingData?.hasSubscription ? "Active Subscription" : "Access Level")}
                           </span>

                           {isLoadingBilling ? (
                              <div className="animate-pulse space-y-4">
                                 <div className="h-10 bg-white/20 w-1/2" />
                                 <div className="h-6 bg-white/10 w-1/4" />
                              </div>
                           ) : (
                              <>
                                 <h3 className="text-4xl font-serif italic mb-4">
                                    {billingData?.planName || "Free Access"}
                                 </h3>
                                 <p className="text-2xl font-light opacity-60">
                                    {billingData?.hasSubscription ? `$${billingData.amount} / month` : "Clinical basic protocols only."}
                                 </p>
                                 <div className="mt-12 flex gap-4">
                                    <button
                                       onClick={() => window.location.href = '/pricing'}
                                       className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-semrush-orange hover:text-white transition-all"
                                    >
                                       {billingData?.hasSubscription ? "Manage via Paddle" : "Upgrade Protocol"}
                                    </button>
                                    {billingData?.hasSubscription && (
                                       <button className="px-8 py-3 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                          Cancel
                                       </button>
                                    )}
                                 </div>
                              </>
                           )}
                        </div>

                        <div className="bg-white p-12 shadow-sm border border-black/5">
                           <h4 className="text-label opacity-40 mb-8 block font-bold">Transaction History</h4>
                           <div className="space-y-6">
                              {isLoadingBilling ? (
                                 <div className="animate-pulse space-y-4">
                                    <div className="h-12 bg-black/5 w-full" />
                                    <div className="h-12 bg-black/5 w-full" />
                                 </div>
                              ) : billingData?.transactions && billingData.transactions.length > 0 ? (
                                 billingData.transactions.map((inv: Transaction, i: number) => (
                                    <div key={i} className="flex justify-between items-center py-4 border-b border-black/5 last:border-0 group cursor-pointer hover:px-4 transition-all">
                                       <div>
                                          <p className="font-serif italic text-lg">{inv.id}</p>
                                          <p className="text-[10px] font-bold text-fashion-gray uppercase tracking-widest">
                                             {new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                          </p>
                                       </div>
                                       <div className="text-right">
                                          <span className="font-bold text-sm block">${inv.amount}</span>
                                          <span className="text-[8px] uppercase tracking-tighter block opacity-40">{inv.status}</span>
                                       </div>
                                    </div>
                                 ))
                              ) : (
                                 <div className="py-12 text-center">
                                    <p className="text-sm font-light text-fashion-gray italic">No technical transactions recorded yet.</p>
                                 </div>
                              )}
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
                        <div className="flex justify-between items-center border-b border-black/5 pb-4 mb-8">
                           <h3 className="text-xl font-serif italic">Intelligence Alerts</h3>
                           <span className="text-[8px] font-bold uppercase tracking-[0.2em] bg-semrush-orange/10 text-semrush-orange px-3 py-1 rounded-full">
                              Planned for 2026
                           </span>
                        </div>
                        <div className="space-y-8">
                           {[
                              { label: "Daily Position Briefing", key: "notifDailyBrief", desc: "Receive metadata on keyword movements every 24h" },
                              { label: "Security Breach Alerts", key: "notifSecurity", desc: "Immediate notification if domain health drops 10%+" },
                              { label: "Competitor Infiltration", key: "notifCompetitors", desc: "Alerts when a rival captures your primary search real estate" },
                           ].map((alert, i) => (
                              <div key={i} className="flex items-center justify-between group">
                                 <div className="max-w-md">
                                    <h4 className="text-xs font-bold uppercase tracking-widest mb-1">{alert.label}</h4>
                                    <p className="text-sm font-light text-fashion-gray italic">{alert.desc}</p>
                                 </div>
                                 <div
                                    onClick={() => setFormData(prev => ({ ...prev, [alert.key]: !prev[alert.key as keyof typeof formData] }))}
                                    className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${formData[alert.key as keyof typeof formData] ? 'bg-semrush-orange' : 'bg-black/10'}`}
                                 >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 transition-all duration-300 ${formData[alert.key as keyof typeof formData] ? 'left-7' : 'left-1'}`} />
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
