import { hotspots } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function HotspotsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Demand Hotspots</h2>
        <p className="text-slate-500 mt-1">
          Geographic concentration of citizen demand mapped against infrastructure gaps
        </p>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="text-center mb-8">
          <p className="text-sm text-slate-500">Interactive map placeholder — integrate GeoJSON or Mapbox</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hotspots.map((hotspot) => (
            <div key={hotspot.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{hotspot.region}</p>
                  <p className="text-xs text-slate-500 mt-0.5 capitalize">{hotspot.topIssue.replace(/_/g, " ")}</p>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    hotspot.demandScore >= 85
                      ? "bg-red-100 text-red-700"
                      : hotspot.demandScore >= 70
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  )}
                >
                  {hotspot.demandScore >= 85 ? "Critical" : hotspot.demandScore >= 70 ? "High" : "Moderate"}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Demand Score</span>
                    <span className="font-medium text-slate-900">{hotspot.demandScore}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full",
                        hotspot.demandScore >= 85 && "bg-red-500",
                        hotspot.demandScore >= 70 && hotspot.demandScore < 85 && "bg-amber-500",
                        hotspot.demandScore < 70 && "bg-green-500"
                      )}
                      style={{ width: `${hotspot.demandScore}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Submissions</span>
                  <span className="font-medium text-slate-900">{hotspot.submissionCount}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Growth Rate</span>
                  <span className={cn("font-medium", hotspot.growthRate > 0 ? "text-red-600" : "text-green-600")}>
                    {hotspot.growthRate > 0 ? "+" : ""}{hotspot.growthRate}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
