import { rankings } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function RankingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Prioritized Development Works</h2>
        <p className="text-slate-500 mt-1">
          Ranked by demand, alignment with plans, infrastructure gap, and beneficiary count
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 font-medium text-slate-500">Rank</th>
                <th className="px-6 py-3 font-medium text-slate-500">Project</th>
                <th className="px-6 py-3 font-medium text-slate-500">Region</th>
                <th className="px-6 py-3 font-medium text-slate-500">Category</th>
                <th className="px-6 py-3 font-medium text-slate-500">Demand</th>
                <th className="px-6 py-3 font-medium text-slate-500">Alignment</th>
                <th className="px-6 py-3 font-medium text-slate-500">Gap</th>
                <th className="px-6 py-3 font-medium text-slate-500">Priority</th>
                <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                <th className="px-6 py-3 font-medium text-slate-500">Budget</th>
                <th className="px-6 py-3 font-medium text-slate-500">Beneficiaries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankings.map((r, idx) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="size-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{r.project}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{r.region}</td>
                  <td className="px-6 py-4 capitalize text-slate-600">{r.category.replace(/_/g, " ")}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-200 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${r.demandScore}%` }} />
                      </div>
                      <span className="text-slate-600">{r.demandScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{r.alignmentScore}</td>
                  <td className="px-6 py-4 text-slate-600">{r.infrastructureGap}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{r.priorityScore.toFixed(1)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                        r.status === "proposed" && "bg-slate-100 text-slate-700",
                        r.status === "approved" && "bg-blue-100 text-blue-700",
                        r.status === "in_progress" && "bg-amber-100 text-amber-700",
                        r.status === "completed" && "bg-green-100 text-green-700"
                      )}
                    >
                      {r.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    ${(r.budgetEstimate / 100000).toFixed(1)}L
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {r.beneficiaries.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
