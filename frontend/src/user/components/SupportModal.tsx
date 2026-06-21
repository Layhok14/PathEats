// Support / Feedback modal — open to all users including guests.
// TODO: replace handleSubmit body with POST /api/support when backend is live.

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, MessageSquare } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import { useAuth } from "../../shared/hooks/useAuth";

/**
 * @param {{ onClose: ()=>void }} props
 */
export function SupportModal({ onClose }) {
  const { tm, darkMode } = useTheme();
  const { user } = useAuth();

  const [name, setName]     = useState(user ? `${user.firstName} ${user.lastName}` : "");
  const [email, setEmail]   = useState(user?.email ?? "");
  const [message, setMessage] = useState("");
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim())    { setError("Please enter your name.");    return; }
    if (!email.trim())   { setError("Please enter your email.");   return; }
    if (!message.trim()) { setError("Please enter your message."); return; }
    setError(""); setLoading(true);
    // TODO: POST /api/support { name, email, message }
    await new Promise(r => setTimeout(r, 700));
    setLoading(false); setSent(true);
  }

  const panelBg = darkMode ? "#111828" : "#ffffff";
  const inp = { background: tm.inputBg, border: `1px solid ${tm.inputBorder}`, color: tm.text1 };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[800] flex items-end sm:items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        <motion.div className="relative w-full max-w-md rounded-2xl overflow-hidden"
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.22 }}
          style={{ background: panelBg, border: `1px solid ${tm.border}`, boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>

          {/* Header */}
          <div className="px-6 pt-5 pb-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${tm.border}` }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.12)" }}>
                <MessageSquare size={15} style={{ color: "#22c55e" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: tm.text1 }}>Send Feedback</p>
                <p className="text-[11px]" style={{ color: tm.text4 }}>We read every submission</p>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors" style={{ background: tm.surface2 }}>
              <X size={13} style={{ color: tm.text3 }} />
            </button>
          </div>

          <div className="px-6 py-5">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(34,197,94,0.12)" }}>
                  <Send size={20} style={{ color: "#22c55e" }} />
                </div>
                <p className="text-base font-semibold" style={{ color: tm.text1 }}>Thank you!</p>
                <p className="text-sm" style={{ color: tm.text4 }}>Your feedback has been sent. We'll get back to you soon.</p>
                <button onClick={onClose} className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                  style={{ background: "#22c55e", color: "#ffffff" }}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: tm.text4 }}>Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                      className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                      style={inp} />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: tm.text4 }}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                      className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                      style={inp} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: tm.text4 }}>Message</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                    placeholder="Tell us what you think, report a bug, or suggest a feature…"
                    className="w-full px-3 py-2.5 rounded-xl text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                    style={inp} />
                </div>

                {error && <p className="text-[12px] text-red-400">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                  style={{ background: "#22c55e", color: "#ffffff" }}>
                  <Send size={13} /> {loading ? "Sending…" : "Send Feedback"}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
