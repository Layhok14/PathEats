import { useEffect, useState } from "react";
import { Mail, Send, X, RefreshCw, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { getAdminMessages, getAdminMessageById, getAdminMessageReplies, addAdminMessageReply, updateAdminMessageStatus, type SupportMessage, type MessageReply } from "../../services/adminDashboardService";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [replies, setReplies] = useState<MessageReply[]>([]);
  const [replyText, setReplyText] = useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getAdminMessages();
      setMessages(data);
    } catch (err) { toast.error("Could not load messages."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadMessages(); }, []);

  const openMessage = async (id: string) => {
    setSelectedId(id);
    try {
      const [msg, msgReplies] = await Promise.all([getAdminMessageById(id), getAdminMessageReplies(id)]);
      setSelectedMessage(msg);
      setReplies(msgReplies);
    } catch (err) { toast.error("Could not load message."); }
  };

  const handleSend = async () => {
    if (!replyText.trim() || !selectedId) return;
    try {
      await addAdminMessageReply(selectedId, replyText);
      toast.success("Reply sent.");
      setReplyText("");
      const [msg, r] = await Promise.all([getAdminMessageById(selectedId), getAdminMessageReplies(selectedId)]);
      setSelectedMessage(msg);
      setReplies(r);
    } catch (err) { toast.error("Failed to send."); }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 flex">
        <div className="w-[350px] shrink-0 border-r border-[#e2e8f0] bg-white flex flex-col">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <h1 className="text-[18px] font-bold">Messages</h1>
            <p className="text-[12px] text-[#64748b]">Customer inquiries</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {loading ? <div className="p-8 text-center">Loading...</div> : messages.length === 0 ? (
              <div className="p-8 text-center"><MessageSquare size={24} className="mx-auto mb-2 opacity-50" /><p className="text-[13px] text-[#94a3b8]">No messages</p></div>
            ) : (
              messages.map((m) => (
                <button key={m.id} onClick={() => openMessage(m.id)} className={`w-full text-left px-5 py-3 hover:bg-[#f8fafc] ${selectedId === m.id ? "bg-[#f0fdf4]" : ""}`}>
                  <p className="text-[13px] font-semibold truncate">{m.subject}</p>
                  <p className="text-[11px] text-[#64748b]">{m.senderName}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${m.status === "open" ? "bg-red-50 text-[#ba1a1a]" : m.status === "in_progress" ? "bg-amber-50" : "bg-green-50 text-[#006e2f]"}`}>{m.status}</span>
                </button>
              ))
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          {!selectedMessage ? (
            <div className="flex-1 flex items-center justify-center"><Mail size={32} className="opacity-30" /><p className="text-[13px] text-[#94a3b8]">Select a message</p></div>
          ) : (
            <>
              <div className="px-6 py-4 border-b"><h2 className="text-[16px] font-bold">{selectedMessage.subject}</h2><p className="text-[12px] text-[#64748b]">{selectedMessage.senderName} — {selectedMessage.ticketId}</p></div>
              <div className="px-6 py-4 bg-[#fafbfc] border-b"><p className="text-[13px] whitespace-pre-wrap">{selectedMessage.messageBody}</p></div>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {replies.map((r) => (<div key={r.id} className="flex gap-3"><div className="w-8 h-8 rounded-full bg-[#006e2f] flex items-center justify-center text-white text-[11px] font-bold">{r.repliedBy.slice(0,2).toUpperCase()}</div><div className="flex-1"><p className="text-[13px]">{r.replyBody}</p></div></div>))}
              </div>
              <div className="px-6 py-4 border-t">
                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write your reply..." rows={3} className="w-full border border-[#e2e8f0] rounded-lg px-4 py-3 text-[13px] outline-none focus:border-[#006e2f] resize-none" />
                <button onClick={handleSend} disabled={!replyText.trim()} className="mt-2 bg-[#006e2f] text-white px-4 py-2 rounded-lg hover:bg-[#005a26] disabled:opacity-60 text-[13px] font-medium"><Send size={14} className="inline mr-1" /> Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}