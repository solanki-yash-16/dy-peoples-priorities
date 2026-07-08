import React from 'react';
import { Command, ShieldCheck, MapPin } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
      
      {/* Left Pane - Branding (Hidden on mobile) */}
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between overflow-hidden bg-zinc-950 p-12 text-white">
        
        {/* Subtle Background Gradient / Patterns */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-[20%] -left-[10%] h-[50%] w-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute top-[60%] left-[60%] h-[40%] w-[40%] rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <Command className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">People&apos;s Priorities</span>
        </div>

        <div className="relative z-10 mt-auto">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight leading-tight lg:text-5xl">
            AI for Constituency <br />
            Development Planning
          </h1>
          <p className="max-w-md text-lg text-zinc-400">
            Empowering Members of Parliament with AI-driven insights to prioritize development projects based on citizen feedback.
          </p>
          
          <div className="mt-12 flex flex-col gap-6">
            <div className="flex items-center gap-4 text-zinc-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10">
                <MapPin className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="font-medium text-white">Geospatial Insights</p>
                <p className="text-sm">Visualize civic issues instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-zinc-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10">
                <ShieldCheck className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="font-medium text-white">Secure Architecture</p>
                <p className="text-sm">Enterprise-grade data protection</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 mt-20 text-sm text-zinc-500">
          © {new Date().getFullYear()} DY Peoples Priorities. All rights reserved.
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </div>

    </div>
  );
}
