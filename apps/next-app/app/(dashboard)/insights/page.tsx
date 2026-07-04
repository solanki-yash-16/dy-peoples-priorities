import { insights } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">AI Insights</h2>
        <p className="text-slate-500 mt-1">
          Machine-generated intelligence from cross-referencing citizen demand, demographics, and infrastructure data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    insight.type === "correlation" && "bg-blue-100 text-blue-700",
                    insight.type === "anomaly" && "bg-amber-100 text-amber-700",
                    insight.type === "prediction" && "bg-purple-100 text-purple-700",
                    insight.type === "recommendation" && "bg-emerald-100 text-emerald-700"
                  )}
                >
                  {insight.type === "correlation" && (
                    <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  )}
                  {insight.type === "anomaly" && (
                    <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                  {insight.type === "prediction" && (
                    <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                  {insight.type === "recommendation" && (
                    <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-slate-100 text-slate-700">
                  {insight.type}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {Math.round(insight.confidence * 100)}% confidence
              </span>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">{insight.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{insight.description}</p>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Related projects:</span>
              <div className="flex flex-wrap gap-1.5">
                {insight.relatedProjects.map((pid) => (
                  <span key={pid} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                    {pid}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
