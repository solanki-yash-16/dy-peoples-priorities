import { ComplaintForm } from "@/components/forms/ComplaintForm"

export const metadata = {
  title: "File a Complaint | Dy People's Priorities",
  description: "Submit a citizen complaint directly to the authorities.",
}

export default function ComplaintPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col relative overflow-hidden">
      
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20 relative z-10">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Citizen Connect
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Your voice shapes our community. Report local issues securely, and track the progress as we work together to build a better constituency.
          </p>
        </div>

        <ComplaintForm />
        
      </main>
      
      {/* Footer / Info */}
      <footer className="mt-auto py-8 text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} Dy People&apos;s Priorities. All rights reserved.</p>
        <p className="mt-2">Powered by Google Build with AI Hackathon</p>
      </footer>
    </div>
  )
}
