import type { ReactNode } from "react";
import { X, Eye, Database, Search, Settings, Ban, Clock, ListOrdered, Tags, Star, UserRound, CheckCircle } from "lucide-react";

export const USER_STATUS_FILTERS = ["All", "Active", "Banned"] as const;

export function formatValue(value: unknown) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

export function DetailModal({
  title,
  details,
  onClose,
}: {
  title: string;
  details: Record<string, unknown> | null;
  onClose: () => void;
}) {
  const entries = Object.entries(details ?? {});
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[680px] max-h-[calc(100vh-32px)] overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#0b1c30]">{title}</h2>
            <p className="text-[12px] text-[#64748b]">All available columns</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#334155] hover:bg-[#f1f5f9]">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-6">
          {entries.length === 0 ? (
            <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 py-6 text-center text-[13px] text-[#64748b]">
              No data available.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-[#e2e8f0]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="w-[210px] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Column</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(([key, value]) => (
                    <tr key={key} className="border-t border-[#f1f5f9]">
                      <td className="px-4 py-3 font-mono text-[12px] font-medium text-[#0b1c30]">{key}</td>
                      <td className="whitespace-pre-wrap break-words px-4 py-3 text-[12px] text-[#475569]">{formatValue(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const iconMap: Record<string, ReactNode> = {
  users: <Database size={16} />,
  user_preferences: <Settings size={16} />,
  search_history: <Search size={16} />,
  menu_items: <ListOrdered size={16} />,
  place_categories: <Tags size={16} />,
  place_hours: <Clock size={16} />,
  reviews: <Star size={16} />,
};

export function SummaryCell({
  tableName,
  cell,
  onView,
}: {
  tableName: string;
  icon?: ReactNode;
  cell: { label: string; subLabel?: string; details?: Record<string, unknown> | null };
  onView: () => void;
}) {
  const icon = iconMap[tableName] || <Database size={16} />;
  const hasDetails = Boolean(cell.details);
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#006e2f]">{icon}</div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-[#0b1c30]">{cell.label}</p>
          <p className="truncate text-[11px] text-[#64748b]">{cell.subLabel || tableName}</p>
        </div>
      </div>
      <button
        onClick={onView}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${hasDetails ? "text-[#006e2f] hover:bg-green-50" : "text-[#94a3b8] hover:bg-gray-50"}`}
        title={`View ${tableName} details`}
      >
        <Eye size={15} />
      </button>
    </div>
  );
}
