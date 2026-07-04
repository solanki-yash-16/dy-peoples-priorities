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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 mt-1">
          Consolidated citizen intelligence for evidence-based decision making
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
            <p className="text-sm text-slate-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Top Priority Projects</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {rankings.slice(0, 3).map((r) => (
              <div key={r.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{r.project}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.region} · {r.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{r.priorityScore.toFixed(1)}</p>
                  <p className="text-xs text-slate-400">priority score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Recurring Themes</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {themes.map((t) => (
              <div key={t.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.frequency} submissions</p>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Demand Hotspots</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-3 font-medium text-slate-500">Region</th>
                  <th className="px-6 py-3 font-medium text-slate-500">Demand Score</th>
                  <th className="px-6 py-3 font-medium text-slate-500">Top Issue</th>
                  <th className="px-6 py-3 font-medium text-slate-500">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hotspots.map((h) => (
                  <tr key={h.id}>
                    <td className="px-6 py-3 font-medium text-slate-900">{h.region}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${h.demandScore}%` }}
                          />
                        </div>
                        <span className="text-slate-600">{h.demandScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-600 capitalize">{h.topIssue.replace(/_/g, " ")}</td>
                    <td className="px-6 py-3">
                      <span className={cn("font-medium", h.growthRate > 0 ? "text-red-600" : "text-green-600")}>
                        {h.growthRate > 0 ? "+" : ""}{h.growthRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">AI Insights</h3>
          </div>
          <div className="p-4 space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
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
                <p className="text-sm font-medium text-slate-900">{insight.title}</p>
                <p className="text-xs text-slate-500 mt-1">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
