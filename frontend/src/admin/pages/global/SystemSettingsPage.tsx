// import { useState } from "react";
// import { Globe, Eye, Shield, Save, CheckCircle } from "lucide-react";
// import { TopBar } from "../../components/TopBar";

// interface ToggleItem { label: string; enabled: boolean }
// interface RuleItem { label: string; checked: boolean }

// function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
//   return (
//     <div onClick={() => onChange(!checked)} className={`relative w-[44px] h-[24px] rounded-full transition-colors cursor-pointer ${checked ? "bg-[#006e2f]" : "bg-[#d1d5db]"}`}>
//       <span className={`absolute top-[2px] left-[2px] w-[20px] h-[20px] bg-white rounded-full shadow transition-transform ${checked ? "translate-x-[20px]" : "translate-x-0"}`} />
//     </div>
//   );
// }

// export default function SystemSettingsPage() {
//   const [distance, setDistance] = useState(1.2);
//   const [cache, setCache] = useState("15 Minutes (Balanced)");
//   const [mfa, setMfa] = useState(true);
//   const [ipWhitelist, setIpWhitelist] = useState("192.168.1.1, 10.0.0.1");
//   const [saved, setSaved] = useState(false);
//   const [categories, setCategories] = useState<ToggleItem[]>([
//     { label: "Street Food", enabled: true }, { label: "Night Market", enabled: true }, { label: "Fine Dining", enabled: false }, { label: "Coffee & Bakery", enabled: true },
//   ]);
//   const [passwordRules, setPasswordRules] = useState<RuleItem[]>([
//     { label: "Minimum 12 Characters", checked: true }, { label: "Uppercase & Symbols", checked: true }, { label: "Biometric Unlock (WebAuthn)", checked: false },
//   ]);

//   const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

//   return (
//     <div className="flex flex-col min-h-full bg-[#f8fafc]">
//       <div className="h-16 bg-[#f8f9ff] border-b border-[#e2e8f0] flex items-center justify-between px-8 gap-4 shrink-0 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sticky top-0 z-10">
//         <div className="flex items-center gap-3">
//           <span className="text-[15px] font-semibold text-[#0b1c30]">System Settings</span>
//           <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]">PRODUCTION</span>
//         </div>
//         <button onClick={handleSave} className={`inline-flex items-center gap-2 font-medium rounded-lg px-4 py-2 text-[13px] ${saved ? "border border-[#bccbb9] text-[#374151] bg-white" : "bg-[#006e2f] text-white hover:bg-[#005a26]"}`}>
//           {saved ? <CheckCircle size={14} /> : <Save size={14} />}
//           {saved ? "Settings Saved" : "Save Configuration"}
//         </button>
//       </div>
//       <div className="flex-1 p-8 flex flex-col gap-6">
//         <p className="text-[14px] text-[#64748b] max-w-2xl">Configure high-level parameters for the PathEat discovery engine and administrative security protocols.</p>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col gap-5">
//             <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center"><Globe size={18} className="text-[#006e2f]" /></div><div><p className="text-[14px] font-semibold text-[#0b1c30]">Global Rules</p><p className="text-[12px] text-[#64748b]">Core engine distance and caching parameters</p></div></div>
//             <div className="flex flex-col gap-2">
//               <div className="flex items-center justify-between"><p className="text-[13px] font-medium text-[#0b1c30]">Route Envelope Distance</p><span className="text-[12px] font-semibold text-[#005ac2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">{distance.toFixed(1)} km</span></div>
//               <input type="range" min={0.1} max={5.0} step={0.1} value={distance} onChange={(e) => setDistance(parseFloat(e.target.value))} className="w-full accent-[#006e2f] h-2 rounded-full" />
//               <div className="flex justify-between text-[11px] text-[#94a3b8]"><span>0.1km</span><span>5.0km</span></div>
//             </div>
//             <div className="flex flex-col gap-2">
//               <p className="text-[13px] font-medium text-[#0b1c30]">Cache Duration</p>
//               <select value={cache} onChange={(e) => setCache(e.target.value)} className="text-[13px] px-3 py-2 border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151]">
//                 {["5 Minutes (Aggressive)", "15 Minutes (Balanced)", "30 Minutes (Conservative)", "1 Hour (Static)"].map((o) => (<option key={o}>{o}</option>))}
//               </select>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col gap-4">
//             <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center"><Eye size={18} className="text-[#005ac2]" /></div><div><p className="text-[14px] font-semibold text-[#0b1c30]">Category Visibility</p><p className="text-[12px] text-[#64748b]">Toggle global discovery categories</p></div></div>
//             <div className="flex flex-col divide-y divide-[#f1f5f9]">
//               {categories.map((c, i) => (<div key={c.label} className="flex items-center justify-between py-3"><span className="text-[13px] text-[#0b1c30]">{c.label}</span><Toggle checked={c.enabled} onChange={() => setCategories(prev => prev.map((x, idx) => idx === i ? { ...x, enabled: !x.enabled } : x))} /></div>))}
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
//           <div className="flex items-center gap-3 mb-5"><div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center"><Shield size={18} className="text-[#ef4444]" /></div><div><p className="text-[14px] font-semibold text-[#0b1c30]">Security</p><p className="text-[12px] text-[#64748b]">Administrative access and authentication protocols</p></div></div>
//           <div className="grid grid-cols-3 gap-8">
//             <div className="flex flex-col gap-3">
//               <div className="flex items-center justify-between"><p className="text-[13px] font-medium text-[#0b1c30]">Multi-Factor Auth (MFA)</p><Toggle checked={mfa} onChange={setMfa} /></div>
//               <p className="text-[12px] text-[#64748b]">Enforce secondary authentication via SMS or Authenticator App for all admin users.</p>
//             </div>
//             <div className="flex flex-col gap-3">
//               <p className="text-[13px] font-medium text-[#0b1c30]">Password Complexity</p>
//               {passwordRules.map((r, i) => (
//                 <label key={r.label} className="flex items-center gap-2 cursor-pointer">
//                   <input type="checkbox" checked={r.checked} onChange={() => setPasswordRules(prev => prev.map((x, idx) => idx === i ? { ...x, checked: !x.checked } : x))} className="w-4 h-4 accent-[#006e2f] rounded" />
//                   <span className="text-[12px] text-[#374151]">{r.label}</span>
//                 </label>
//               ))}
//             </div>
//             <div className="flex flex-col gap-3">
//               <p className="text-[13px] font-medium text-[#0b1c30]">IP Whitelist</p>
//               <textarea value={ipWhitelist} onChange={(e) => setIpWhitelist(e.target.value)} rows={3} className="text-[12px] px-3 py-2 border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] resize-none text-[#374151] font-mono" />
//               <p className="text-[11px] text-[#94a3b8]">Comma separated list of allowed administrative IP addresses.</p>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center justify-between text-[12px] text-[#94a3b8] pt-2 border-t border-[#e2e8f0]">
//           <span>Last system audit: Today, 08:42 AM</span>
//           <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#006e2f]" />Service: Active &amp; Synchronized</span>
//         </div>
//       </div>
//     </div>
//   );
// }
