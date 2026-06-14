import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { GrowthDataPoint } from "../../shared/types";

interface Props {
  data: GrowthDataPoint[];
}

export function GrowthChart({ data }: Props) {
  const [period, setPeriod] = useState<"Week" | "Month">("Month");
  const max = Math.max(...data.map((d) => d.orders));

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-[#0b1c30]">Growth Analytics</h2>
        <div className="flex rounded-lg border border-[#e2e8f0] overflow-hidden">
          {(["Week", "Month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 text-[12px] font-medium transition-colors ${period === p ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-gray-50"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barCategoryGap="30%" margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(0,110,47,0.06)" }}
            contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }}
            formatter={(v: number) => [v, "Orders"]}
          />
          <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.day}
                fill={entry.orders === max ? "#006e2f" : "#a7f3c0"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
