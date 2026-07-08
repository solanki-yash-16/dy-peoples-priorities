'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useComplaintDetails, useUpdateComplaintStatus } from '@/hooks/use-complaints';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { Button } from '@repo/ui';
import { ChevronLeft, MapPin, User, Clock, AlertTriangle, FileText, BrainCircuit } from 'lucide-react';

export default function ComplaintDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // Unwrap the Promise params (Next.js 16 requirement for Server/Client Components dynamic params)
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data: complaint, isLoading, error } = useComplaintDetails(id);
  const updateStatusMutation = useUpdateComplaintStatus();

  const handleStatusUpdate = (newStatus: string) => {
    updateStatusMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => {
          // Toast handled in hook
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <h2 className="text-xl font-semibold">Complaint not found</h2>
        <p className="text-muted-foreground mb-6">The complaint you are looking for does not exist or an error occurred.</p>
        <Button onClick={() => router.back()} className="bg-foreground text-background">Go Back</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{complaint.aiAnalysis?.summary || complaint.description?.originalText || 'Complaint Details'}</h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize border ${getStatusColor(complaint.status)}`}>
              {complaint.status.replace('_', ' ')}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-medium capitalize text-slate-800">
              {complaint.aiAnalysis?.urgencyScore !== undefined ? `${complaint.aiAnalysis.urgencyScore} Priority` : 'Priority Not Analyzed'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">ID: {complaint._id} • Created on {new Date(complaint.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {complaint.description?.originalText || "No text description provided."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Village/Area</p>
                  <p className="text-sm font-medium">{complaint.location?.village || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">District</p>
                  <p className="text-sm font-medium">{complaint.location?.district || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Full Address</p>
                  <p className="text-sm">{complaint.location?.address || "N/A"}</p>
                </div>
                {complaint.location?.coordinates && (
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Coordinates</p>
                    <p className="text-sm font-mono bg-muted p-1 rounded w-max">
                      {complaint.location.coordinates[1].toFixed(4)}, {complaint.location.coordinates[0].toFixed(4)}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Map Placeholder */}
              <div className="h-[200px] w-full bg-muted rounded-md border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=0,0&zoom=1&size=600x300&sensor=false')] opacity-20 bg-cover bg-center"></div>
                <div className="z-10 flex flex-col items-center">
                  <MapPin className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium">Map View Available via API</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attached Media</CardTitle>
            </CardHeader>
            <CardContent>
              {complaint.media && complaint.media.filter(m => m.type === 'IMAGE').length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {complaint.media.filter(m => m.type === 'IMAGE').map((m, i) => (
                    <div key={i} className="aspect-square bg-muted rounded-md border overflow-hidden relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.url} alt={`Evidence ${i+1}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/400?text=Image+Not+Found')} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-md">
                  No images attached to this complaint.
                </div>
              )}
              
              {complaint.media && complaint.media.find(m => m.type === 'VOICE') && (
                <div className="mt-4 p-4 bg-muted/50 rounded-md border flex items-center gap-4">
                  <audio controls className="w-full h-10">
                    <source src={complaint.media.find(m => m.type === 'VOICE')?.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card className="border-primary/20 shadow-sm bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                AI Analysis
              </CardTitle>
              <CardDescription>Automated insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Suggested Department</p>
                  <p className="text-sm font-medium">{complaint.aiAnalysis?.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Sentiment Score</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 w-[80%]"></div>
                    </div>
                    <span className="text-xs font-bold text-red-600">High Frustration</span>
                  </div>
                </div>
                <div className="bg-white/60 p-3 rounded text-sm border border-primary/10">
                  <strong>Summary:</strong> The citizen is reporting a severe infrastructure issue in their locality which has persisted for over 2 weeks without resolution.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                Citizen Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {complaint.user?.name?.charAt(0) || complaint.userId?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium">{complaint.user?.name || complaint.userId || 'Anonymous Citizen'}</p>
                  <p className="text-xs text-muted-foreground">ID: {complaint.user?._id || complaint.userId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Update Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Update the resolution status of this complaint. This will notify the citizen.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={updateStatusMutation.isPending || complaint.status === 'in_progress'}
                  className={`w-full justify-start ${complaint.status === 'in_progress' ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
                  onClick={() => handleStatusUpdate('in_progress')}
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                  In Progress
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={updateStatusMutation.isPending || complaint.status === 'resolved'}
                  className={`w-full justify-start ${complaint.status === 'resolved' ? 'border-green-500 ring-1 ring-green-500' : ''}`}
                  onClick={() => handleStatusUpdate('resolved')}
                >
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                  Resolved
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={updateStatusMutation.isPending || complaint.status === 'rejected'}
                  className={`w-full justify-start col-span-1 sm:col-span-2 ${complaint.status === 'rejected' ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  onClick={() => handleStatusUpdate('rejected')}
                >
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                  Rejected
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
