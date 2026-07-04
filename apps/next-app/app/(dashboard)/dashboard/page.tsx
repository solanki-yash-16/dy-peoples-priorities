import { submissions, themes, hotspots, rankings, insights } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total Submissions", value: submissions.length.toLocaleString(), sub: "+12% from last month" },
  { label: "Active Themes", value: themes.length.toString(), sub: "Recurring citizen demands" },
  { label: "Demand Hotspots", value: hotspots.length.toString(), sub: "Regions with high urgency" },
  { label: "Ranked Projects", value: rankings.length.toString(), sub: "Awaiting MP decision" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">
          Consolidated citizen intelligence for evidence-based decision making
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm min-w-0">
            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">{stat.label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 sm:mt-2">{stat.value}</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-w-0">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Top Priority Projects</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {rankings.slice(0, 3).map((r) => (
              <div key={r.id} className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 text-sm truncate">{r.project}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{r.region} · {r.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-900">{r.priorityScore.toFixed(1)}</p>
                  <p className="text-xs text-slate-400">priority score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-w-0">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Recurring Themes</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {themes.map((t) => (
              <div key={t.id} className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 text-sm truncate">{t.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{t.frequency} submissions</p>
                </div>
                <div className="shrink-0">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
                      t.trend === "up"
                        ? "bg-red-100 text-red-700"
                        : t.trend === "down"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-700"
                    )}
                  >
                    {t.trend === "up" ? "↑ Rising" : t.trend === "down" ? "↓ Falling" : "→ Stable"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm min-w-0">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Demand Hotspots</h3>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 sm:px-6 py-3 font-medium text-slate-500">Region</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-slate-500">Demand Score</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-slate-500">Top Issue</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-slate-500">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hotspots.map((h) => (
                  <tr key={h.id}>
                    <td className="px-4 sm:px-6 py-3 font-medium text-slate-900 text-xs sm:text-sm">{h.region}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 sm:w-16 bg-slate-200 rounded-full h-1.5 shrink-0">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${h.demandScore}%` }}
                          />
                        </div>
                        <span className="text-slate-600 text-xs sm:text-sm">{h.demandScore}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-slate-600 text-xs sm:text-sm capitalize">{h.topIssue.replace(/_/g, " ")}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <span className={cn("font-medium text-xs sm:text-sm", h.growthRate > 0 ? "text-red-600" : "text-green-600")}>
                        {h.growthRate > 0 ? "+" : ""}{h.growthRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-w-0">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base">AI Insights</h3>
          </div>
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="p-3 sm:p-4 rounded-lg bg-slate-50 border border-slate-100 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium capitalize whitespace-nowrap",
                      insight.type === "correlation" && "bg-blue-100 text-blue-700",
                      insight.type === "anomaly" && "bg-amber-100 text-amber-700",
                      insight.type === "prediction" && "bg-purple-100 text-purple-700",
                      insight.type === "recommendation" && "bg-emerald-100 text-emerald-700"
                    )}
                  >
                    {insight.type}
                  </span>
                  <span className="text-xs text-slate-400">{Math.round(insight.confidence * 100)}% confidence</span>
                </div>
                <p className="text-sm font-medium text-slate-900 break-words">{insight.title}</p>
                <p className="text-xs text-slate-500 mt-1 break-words">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
