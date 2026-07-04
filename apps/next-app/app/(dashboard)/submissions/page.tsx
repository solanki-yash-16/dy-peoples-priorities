import { submissions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function SubmissionsPage() {
  const sourceLabels: Record<string, string> = {
    public_meeting: "Public Meeting",
    letter: "Letter",
    social_media: "Social Media",
    grievance_portal: "Grievance Portal",
    direct_representation: "Direct Representation",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Submissions</h2>
        <p className="text-slate-500 mt-1">All citizen development suggestions and grievances consolidated</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 font-medium text-slate-500">ID</th>
                <th className="px-6 py-3 font-medium text-slate-500">Title</th>
                <th className="px-6 py-3 font-medium text-slate-500">Source</th>
                <th className="px-6 py-3 font-medium text-slate-500">Category</th>
                <th className="px-6 py-3 font-medium text-slate-500">Region</th>
                <th className="px-6 py-3 font-medium text-slate-500">Sentiment</th>
                <th className="px-6 py-3 font-medium text-slate-500">Upvotes</th>
                <th className="px-6 py-3 font-medium text-slate-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500">#{s.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{s.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{s.description}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{sourceLabels[s.source]}</td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-slate-700">{s.category.replace(/_/g, " ")}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{s.region}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                        s.sentiment === "positive" && "bg-green-100 text-green-700",
                        s.sentiment === "negative" && "bg-red-100 text-red-700",
                        s.sentiment === "neutral" && "bg-slate-100 text-slate-700"
                      )}
                    >
                      {s.sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{s.upvotes}</td>
                  <td className="px-6 py-4 text-slate-500">{s.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
