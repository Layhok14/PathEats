import { useState } from "react";
import { Globe, Eye, Shield, Save, CheckCircle } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { Toggle } from "../../../shared/components/Toggle";
import { Button } from "../../../shared/components/Button";

interface CategoryToggle { label: string; enabled: boolean }
interface PasswordRule { label: string; checked: boolean }

export default function SystemSettingsPage() {
  const [distance, setDistance] = useState(1.2);
  const [cache, setCache] = useState("15 Minutes (Balanced)");
  const [mfa, setMfa] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState("192.168.1.1, 10.0.0.1");
  const [saved, setSaved] = useState(false);

  const [categories, setCategories] = useState<CategoryToggle[]>([
    { label: "Street Food", enabled: true },
    { label: "Night Market", enabled: true },
    { label: "Fine Dining", enabled: false },
    { label: "Coffee & Bakery", enabled: true },
  ]);

  const [passwordRules, setPasswordRules] = useState<PasswordRule[]>([
    { label: "Minimum 12 Characters", checked: true },
    { label: "Uppercase & Symbols", checked: true },
    { label: "Biometric Unlock (WebAuthn)", checked: false },
  ]);

  const toggleCategory = (i: number) =>
    setCategories((prev) => prev.map((c, idx) => idx === i ? { ...c, enabled: !c.enabled } : c));

  const toggleRule = (i: number) =>
    setPasswordRules((prev) => prev.map((r, idx) => idx === i ? { ...r, checked: !r.checked } : r));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      {/* Top bar with production badge */}
      <div className="h-16 bg-[#f8f9ff] border-b border-[#e2e8f0] flex items-center justify-between px-8 gap-4 shrink-0 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-semibold text-[#0b1c30]">System Settings</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]">PRODUCTION</span>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} icon={saved ? <CheckCircle size={14} /> : <Save size={14} />} variant={saved ? "outline" : "primary"}>
            {saved ? "Settings Saved" : "Save Configuration"}
          </Button>
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Intro */}
        <p className="text-[14px] text-[#64748b] max-w-2xl">
          Configure high-level parameters for the PathEat discovery engine and administrative security protocols.
          Changes take effect across the entire fleet within the next sync cycle.
        </p>

        {/* Top 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* Global Rules */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <Globe size={18} className="text-[#006e2f]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#0b1c30]">Global Rules</p>
                <p className="text-[12px] text-[#64748b]">Core engine distance and caching parameters</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-[#0b1c30]">Route Envelope Distance</p>
                <span className="text-[12px] font-semibold text-[#005ac2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {distance.toFixed(1)} km
                </span>
              </div>
              <input
                type="range"
                min={0.1} max={5.0} step={0.1}
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value))}
                className="w-full accent-[#006e2f] h-2 rounded-full"
              />
              <div className="flex justify-between text-[11px] text-[#94a3b8]">
                <span>0.1km</span><span>5.0km</span>
              </div>
              <p className="text-[12px] text-[#64748b] italic">
                Defines how far the engine searches for vendors along the user's active commute path.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-medium text-[#0b1c30]">Cache Duration</p>
              <select
                value={cache}
                onChange={(e) => setCache(e.target.value)}
                className="text-[13px] px-3 py-2 border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151]"
              >
                {["5 Minutes (Aggressive)", "15 Minutes (Balanced)", "30 Minutes (Conservative)", "1 Hour (Static)"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <p className="text-[12px] text-[#64748b]">
                How long route segments are cached in memory before re-querying the mapping service.
              </p>
            </div>
          </div>

          {/* Category Visibility */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Eye size={18} className="text-[#005ac2]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#0b1c30]">Category Visibility</p>
                <p className="text-[12px] text-[#64748b]">Toggle global discovery categories</p>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-[#f1f5f9]">
              {categories.map((c, i) => (
                <div key={c.label} className="flex items-center justify-between py-3">
                  <span className="text-[13px] text-[#0b1c30]">{c.label}</span>
                  <Toggle checked={c.enabled} onChange={() => toggleCategory(i)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
              <Shield size={18} className="text-[#ef4444]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0b1c30]">Security</p>
              <p className="text-[12px] text-[#64748b]">Administrative access and authentication protocols</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {/* MFA */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-[#0b1c30]">Multi-Factor Auth (MFA)</p>
                <Toggle checked={mfa} onChange={setMfa} />
              </div>
              <p className="text-[12px] text-[#64748b]">
                Enforce secondary authentication via SMS or Authenticator App for all admin users.
              </p>
            </div>
            {/* Password complexity */}
            <div className="flex flex-col gap-3">
              <p className="text-[13px] font-medium text-[#0b1c30]">Password Complexity</p>
              {passwordRules.map((r, i) => (
                <label key={r.label} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={r.checked}
                    onChange={() => toggleRule(i)}
                    className="w-4 h-4 accent-[#006e2f] rounded"
                  />
                  <span className="text-[12px] text-[#374151]">{r.label}</span>
                </label>
              ))}
            </div>
            {/* IP Whitelist */}
            <div className="flex flex-col gap-3">
              <p className="text-[13px] font-medium text-[#0b1c30]">IP Whitelist</p>
              <textarea
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                rows={3}
                className="text-[12px] px-3 py-2 border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] resize-none text-[#374151] font-mono"
                placeholder="192.168.1.1, 10.0.0.1"
              />
              <p className="text-[11px] text-[#94a3b8]">Comma separated list of allowed administrative IP addresses.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[12px] text-[#94a3b8] pt-2 border-t border-[#e2e8f0]">
          <span>Last system audit: Today, 08:42 AM</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006e2f]" />
            Service: Active &amp; Synchronized
          </span>
        </div>
      </div>
    </div>
  );
}
