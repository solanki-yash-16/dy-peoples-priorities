import { themes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function ThemesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Recurring Themes</h2>
        <p className="text-slate-500 mt-1">
          AI-consolidated topics surfacing across meetings, letters, social media, and portals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div key={theme.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold text-slate-900">{theme.name}</p>
                <p className="text-xs text-slate-500 mt-1 capitalize">{theme.category}</p>
              </div>
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  theme.trend === "up" && "bg-red-100 text-red-700",
                  theme.trend === "down" && "bg-green-100 text-green-700",
                  theme.trend === "stable" && "bg-slate-100 text-slate-700"
                )}
              >
                {theme.trend === "up" ? "Rising" : theme.trend === "down" ? "Falling" : "Stable"}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Frequency</span>
                <span className="font-medium text-slate-900">{theme.frequency}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Avg Sentiment</span>
                <span className={cn("font-medium", theme.avgSentiment < 0 ? "text-red-600" : "text-green-600")}>
                  {theme.avgSentiment > 0 ? "+" : ""}{theme.avgSentiment.toFixed(1)}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">Affected Regions</p>
                <div className="flex flex-wrap gap-1.5">
                  {theme.regions.map((region) => (
                    <span key={region} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs">
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(theme.frequency * 2.5, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {theme.frequency} mentions across channels
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
