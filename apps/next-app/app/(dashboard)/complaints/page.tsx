'use client';

import { useState } from 'react';
import { useComplaints } from '@/hooks/use-complaints';
import { DataTable } from '@/components/shared/data-table';
import { Complaint } from '@/types/complaint';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Select } from '@repo/ui';
import { Search, SlidersHorizontal, Eye } from 'lucide-react';
import Link from 'next/link';

export default function ComplaintsPage() {
  const [page] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useComplaints({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    district: districtFilter === 'all' ? undefined : districtFilter,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
    sort: '-createdAt'
  });

  const columns = [
    {
      header: 'Title',
      accessorKey: 'description.originalText',
      cell: (item: Complaint) => {
        const displayTitle = item.aiAnalysis?.summary || item.description?.originalText || 'N/A';
        return (
          <div className="font-medium max-w-[200px] sm:max-w-[300px] truncate text-foreground" title={displayTitle}>
            {displayTitle}
          </div>
        );
      },
    },
    {
      header: 'Category',
      accessorKey: 'aiAnalysis.category',
      cell: (item: Complaint) => {
        const category = item.aiAnalysis?.category;
        return (
          <span className="capitalize text-sm text-muted-foreground">
            {category ? category : 'N/A'}
          </span>
        );
      },
    },
    {
      header: 'Location',
      accessorKey: 'location',
      cell: (item: Complaint) => (
        <span className="text-sm text-muted-foreground">
          {item.location?.village || 'Unknown'}, {item.location?.district || 'Unknown'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item: Complaint) => {
        const colors: Record<string, string> = {
          pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400',
          in_progress: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
          resolved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
          rejected: 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400',
        };
        const statusStr = typeof item.status === 'string' ? item.status : 'pending';
        const defaultColor = 'bg-muted text-muted-foreground border-border';
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize border ${colors[statusStr] || defaultColor}`}>
            {statusStr.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      header: 'Priority',
      accessorKey: 'aiAnalysis.urgencyScore',
      cell: (item: Complaint) => {
        const priority = item.aiAnalysis?.urgencyScore;
        return (
          <span className="capitalize text-sm text-muted-foreground">
            {priority !== undefined && priority !== null ? priority : 'Not Analyzed'}
          </span>
        );
      },
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: (item: Complaint) => (
        <span className="text-muted-foreground text-sm whitespace-nowrap">
          {new Date(item.createdAt || Date.now()).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessorKey: '_id',
      cell: (item: Complaint) => (
        <Link href={`/complaints/${item._id}`}>
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs flex items-center gap-2 hover:bg-primary/5 hover:text-primary transition-colors">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </Link>
      ),
    }
  ];

  return (
    <Card className="w-full border-none shadow-none sm:border-border sm:shadow-sm bg-transparent sm:bg-card">
      <CardHeader className="px-0 sm:px-6">
        <CardTitle>Complaints</CardTitle>
        <CardDescription>
          Manage and resolve public complaints with advanced filtering.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 sm:px-6 space-y-6">
        {/* Advanced Toolbar */}
        <div className="flex flex-col gap-4 bg-card rounded-xl border border-border p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search complaints by title or description..."
                className="pl-9 h-10 w-full bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              variant={showFilters ? "secondary" : "outline"}
              className="flex items-center gap-2 h-10 px-4 transition-all w-full sm:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(statusFilter !== 'all' || districtFilter !== 'all' || categoryFilter !== 'all') && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                  !
                </span>
              )}
            </Button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5 border-t border-border mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                <Select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { label: 'All Statuses', value: 'all' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'In Progress', value: 'in_progress' },
                    { label: 'Resolved', value: 'resolved' },
                    { label: 'Rejected', value: 'rejected' },
                  ]}
                  className="bg-background h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">District</label>
                <Select 
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  options={[
                    { label: 'All Districts', value: 'all' },
                    { label: 'North District', value: 'north' },
                    { label: 'South District', value: 'south' },
                    { label: 'East District', value: 'east' },
                    { label: 'West District', value: 'west' },
                  ]}
                  className="bg-background h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</label>
                <Select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  options={[
                    { label: 'All Categories', value: 'all' },
                    { label: 'Infrastructure', value: 'infrastructure' },
                    { label: 'Sanitation', value: 'sanitation' },
                    { label: 'Water Supply', value: 'water' },
                    { label: 'Electricity', value: 'electricity' },
                  ]}
                  className="bg-background h-10"
                />
              </div>
              <div className="sm:col-span-3 flex justify-end mt-2">
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-foreground h-9"
                  onClick={() => {
                    setStatusFilter('all');
                    setDistrictFilter('all');
                    setCategoryFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        <DataTable 
          data={data?.data || []} 
          columns={columns} 
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
