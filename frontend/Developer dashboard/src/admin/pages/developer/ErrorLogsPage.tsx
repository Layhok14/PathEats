import { useState } from "react";
import { Download, Trash2, Filter, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { Button } from "../../../shared/components/Button";
import { MetricCard } from "../../components/MetricCard";
import { ALL_ERROR_LOGS } from "../../../shared/constants/developerData";

type Level = "CRITICAL" | "WARNING" | "INFO";

const LEVEL_STYLE: Record<Level, { bg: string; Icon: typeof AlertCircle }> = {
  CRITICAL: { bg: "bg-red-50 text-red-700",   Icon: AlertCircle },
  WARNING:  { bg: "bg-amber-50 text-amber-700", Icon: AlertTriangle },
  INFO:     { bg: "bg-blue-50 text-blue-700",   Icon: Info },
};

const STATUS_BG: Record<number, string> = {
  500: "bg-red-100 text-red-700",
  503: "bg-red-100 text-red-700",
  404: "bg-amber-100 text-amber-700",
  429: "bg-orange-100 text-orange-700",
  400: "bg-blue-100 text-blue-700",
  200: "bg-green-100 text-green-700",
};

const PAGE_SIZE = 5;
const FILTER_OPTIONS = ["All", "CRITICAL", "WARNING", "INFO"] as const;

export default function ErrorLogsPage() {
  const [severity, setSeverity] = useState<"All" | Level>("All");
  const [page, setPage] = useState(1);

  const filtered = ALL_ERROR_LOGS.filter((l) => severity === "All" || l.level === severity);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar searchPlaceholder="Search logs by keyword or trace ID…" actionLabel="" />

      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Error Logs</h1>
            <p className="text-[13px] text-[#64748b] mt-0.5">Real-time system health monitoring and diagnostic tracing.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" icon={<Trash2 size={14} />}>Clear History</Button>
            <Button icon={<Download size={14} />}>Download Logs</Button>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Critical Errors" value="12"      sub="↑ +8% vs yesterday"    subVariant="red"     topBorderColor="#ef4444" icon={<AlertCircle size={18} />}  accent="#ef4444" />
          <MetricCard label="Warnings"        value="84"      sub="↓ -12% vs yesterday"   subVariant="amber"   topBorderColor="#f59e0b" icon={<AlertTriangle size={18} />} accent="#f59e0b" />
          <MetricCard label="API Latency (Avg)" value="245ms" sub="↑ +24ms from baseline"  subVariant="blue"    topBorderColor="#005ac2" icon={<Filter size={18} />}        accent="#005ac2" />
          <MetricCard label="Uptime"          value="99.98%"  sub="Stable"                 subVariant="green"   topBorderColor="#006e2f" icon={<Info size={18} />}           accent="#006e2f" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          {/* Filter bar */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f1f5f9] flex-wrap">
            <span className="flex items-center gap-1.5 text-[12px] text-[#64748b] font-medium">
              <Filter size={13} /> Filters:
            </span>
            <div className="flex gap-2">
              {FILTER_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => { setSeverity(f === "All" ? "All" : f as Level); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
                    severity === f
                      ? "bg-[#006e2f] text-white border-[#006e2f]"
                      : "border-[#e2e8f0] text-[#64748b] hover:bg-gray-50"
                  }`}
                >
                  {f === "All" ? "Severity: All" : f}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setSeverity("All"); setPage(1); }}
              className="ml-auto text-[12px] font-medium text-[#006e2f] hover:underline"
            >
              Reset All Filters
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc]">
                {["LEVEL", "STATUS", "TIMESTAMP", "ENDPOINT", "MESSAGE SNIPPET"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((log) => {
                const ls = LEVEL_STYLE[log.level as Level] ?? LEVEL_STYLE.INFO;
                const LevelIcon = ls.Icon;
                return (
                  <tr key={log.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded ${ls.bg}`}>
                        <LevelIcon size={11} />
                        {log.level}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${STATUS_BG[log.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-[12px] text-[#64748b] whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-5 py-3 font-mono text-[12px] text-[#006e2f] max-w-[180px] truncate">{log.endpoint}</td>
                    <td className="px-5 py-3 text-[12px] text-[#374151] max-w-[200px] truncate">{log.message}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#f1f5f9]">
            <p className="text-[12px] text-[#94a3b8]">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()} entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-7 h-7 flex items-center justify-center rounded border border-[#e2e8f0] text-[#64748b] hover:bg-gray-50 disabled:opacity-40 text-[12px]"
              >‹</button>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-[12px] font-medium transition-colors ${page === p ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-gray-100"}`}
                >
                  {p}
                </button>
              ))}
              {totalPages > 3 && <span className="text-[#94a3b8] text-[12px] px-1">…</span>}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-7 h-7 flex items-center justify-center rounded border border-[#e2e8f0] text-[#64748b] hover:bg-gray-50 disabled:opacity-40 text-[12px]"
              >›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
