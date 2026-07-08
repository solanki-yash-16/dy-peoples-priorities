'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { AlertCircle, TrendingUp, CheckCircle, Activity, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useComplaintStats, useHeatmap } from '@/hooks/use-complaints';
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DashboardOverview() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useComplaintStats();
  const { data: heatmapData, isLoading: mapLoading } = useHeatmap();

  if (statsLoading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-primary/20" />
          <div className="absolute h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (statsError || !stats) {
    return (
      <div className="flex h-full items-center justify-center text-destructive min-h-[400px]">
        <AlertCircle className="mr-2 h-5 w-5" />
        Failed to load dashboard statistics.
      </div>
    );
  }

  // Transform data for charts
  const categoryData = stats.byCategory?.map(c => ({ name: c._id || 'Unknown', value: c.count })) || [];
  const priorityData = stats.byPriority?.map(p => ({ name: p._id || 'Normal', total: p.count })) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  } as const;

  const tooltipStyle = {
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-card)',
    color: 'var(--color-card-foreground)',
    boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.15)',
    padding: '12px'
  };

  return (
    <div className="relative min-h-screen">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-[10%] top-[20%] h-[30%] w-[30%] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 space-y-8 max-w-[1600px] mx-auto pb-12"
      >
        {/* Hero Welcome Banner */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-8 shadow-sm">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/10 to-transparent opacity-50 dark:opacity-20" />
          <div className="relative z-10 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Insights Active</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-foreground bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Platform Overview
              </h2>
              <p className="mt-2 text-muted-foreground max-w-xl text-lg">
                Monitor constituency development, track citizen priorities, and optimize resource allocation in real-time.
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">System Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">All Systems Operational</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="group relative overflow-hidden border border-border bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Complaints</CardTitle>
              <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-2 relative z-10">
              <div className="text-4xl font-black tracking-tight text-foreground">{stats.total || 0}</div>
              <p className="text-sm text-muted-foreground mt-2 font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" /> Total registered issues
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border border-border bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending</CardTitle>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-2 relative z-10">
              <div className="text-4xl font-black tracking-tight text-foreground">{stats.pending || 0}</div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Awaiting attention</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border border-border bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resolved</CardTitle>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-2 relative z-10">
              <div className="text-4xl font-black tracking-tight text-foreground">{stats.resolved || 0}</div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Issues fixed successfully</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border border-border bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">In Progress</CardTitle>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-2 relative z-10">
              <div className="text-4xl font-black tracking-tight text-foreground">{stats.inProgress || 0}</div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Currently being handled</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
        >
          {/* Category Breakdown (Pie Chart) */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-3 border border-border bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-base font-bold tracking-wide">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] flex items-center justify-center">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        fill="#8884d8"
                        paddingAngle={6}
                        dataKey="value"
                        stroke="none"
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--color-foreground)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                   <div className="flex flex-col items-center justify-center text-muted-foreground">
                     <PieChart className="h-12 w-12 opacity-20 mb-2" />
                     <span className="text-sm font-medium">No category data available</span>
                   </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Priority Breakdown (Bar Chart) */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-4 border border-border bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-base font-bold tracking-wide">Priority Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[320px]">
                {priorityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priorityData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                      <XAxis 
                        dataKey="name" 
                        stroke="var(--color-muted-foreground)" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        style={{ textTransform: 'capitalize' }}
                        dy={10}
                      />
                      <YAxis 
                        stroke="var(--color-muted-foreground)" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `${value}`} 
                        dx={-10}
                      />
                      <Tooltip 
                        cursor={{ fill: 'var(--color-muted)', opacity: 0.2 }}
                        contentStyle={tooltipStyle}
                        itemStyle={{ color: 'var(--color-foreground)' }}
                      />
                      <Bar dataKey="total" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground h-full">
                    <BarChart className="h-12 w-12 opacity-20 mb-2" />
                    <span className="text-sm font-medium">No priority data available</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Map & Live Feed Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Geographic Hotspots */}
          <Card className="col-span-1 lg:col-span-2 border border-border bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-base font-bold tracking-wide">
                <MapPin className="h-5 w-5 text-primary" />
                Geospatial Hotspots
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative min-h-[400px]">
              <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center">
                <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                </div>

                {mapLoading ? (
                  <div className="z-10 relative flex h-14 w-14 items-center justify-center">
                    <div className="absolute h-full w-full animate-ping rounded-full bg-primary/20" />
                    <div className="absolute h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : (
                  <div className="z-10 text-center p-8 bg-card/80 backdrop-blur-xl border border-border rounded-2xl max-w-[320px] shadow-2xl">
                    <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <p className="text-xl font-bold text-foreground mb-2">Interactive Heatmap</p>
                    <p className="text-sm text-muted-foreground mb-6">Monitoring civic priorities and tracking real-time geospatial data.</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/50 dark:border-emerald-900/50 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      {heatmapData?.length || 0} active locations
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Live Complaint Timeline Feed */}
          <Card className="col-span-1 border border-border bg-card/50 backdrop-blur-sm flex flex-col max-h-[500px]">
            <CardHeader className="border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between sticky top-0 z-20">
              <CardTitle className="text-base font-bold tracking-wide flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Live Feed
              </CardTitle>
              <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </button>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1 custom-scrollbar">
              <div className="flex flex-col">
                {stats.recent?.length > 0 ? (
                  stats.recent.map((complaint, i) => {
                    const displayTitle = complaint.aiAnalysis?.summary || complaint.description?.originalText || 'Complaint';
                    return (
                    <div key={complaint._id} className={`group relative flex items-start gap-4 p-5 hover:bg-muted/50 transition-colors duration-200 ${i !== stats.recent.length - 1 ? 'border-b border-border/50' : ''}`}>
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shadow-inner">
                          {displayTitle.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground line-clamp-2 leading-tight pr-2">
                            {displayTitle}
                          </p>
                        </div>
                        <div className="flex items-center flex-wrap gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            complaint.status === 'resolved' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' :
                            complaint.status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' :
                            'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              complaint.status === 'resolved' ? 'bg-emerald-500' :
                              complaint.status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'
                            }`} />
                            {complaint.status?.replace('_', ' ')}
                          </span>
                          
                          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[120px]">{complaint.location?.village || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )})
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground p-12 text-center h-full">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <AlertCircle className="h-6 w-6 opacity-50" />
                    </div>
                    <p className="text-sm font-medium">No recent activity</p>
                    <p className="text-xs mt-1 opacity-70">New submissions will appear here live.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
