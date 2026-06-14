import { UserPlus, Store, AlertTriangle, Database, Info } from "lucide-react";

const iconMap: Record<string, { icon: typeof UserPlus; bg: string; color: string }> = {
  user: { icon: UserPlus, bg: "#dcfce7", color: "#006e2f" },
  restaurant: { icon: Store, bg: "#dbeafe", color: "#005ac2" },
  error: { icon: AlertTriangle, bg: "#fee2e2", color: "#ba1a1a" },
  backup: { icon: Database, bg: "#f1f5f9", color: "#64748b" },
  info: { icon: Info, bg: "#fef3c7", color: "#b45309" },
};

interface ActivityItem { id: string; type: "user" | "restaurant" | "error" | "backup" | "info"; title: string; description: string; time: string }
interface Props { items: ActivityItem[] }

export function SystemActivity({ items }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col gap-4">
      <h2 className="text-[16px] font-semibold text-[#0b1c30]">System Activity</h2>
      <div className="flex flex-col gap-4">
        {items.map((item, i) => {
          const { icon: Icon, bg, color } = iconMap[item.type];
          return (
            <div key={item.id} className="flex gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: bg }}><Icon size={14} style={{ color }} /></div>
                {i < items.length - 1 && <div className="w-px flex-1 bg-[#e2e8f0]" />}
              </div>
              <div className="pb-4 flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#0b1c30]">{item.title}</p>
                <p className="text-[12px] text-[#64748b] mt-0.5">{item.description}</p>
                <p className="text-[11px] text-[#94a3b8] mt-1">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
