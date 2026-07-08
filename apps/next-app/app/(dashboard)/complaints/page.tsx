'use client';

import { useState } from 'react';
import { useComplaints } from '@/hooks/use-complaints';
import { DataTable } from '@/components/shared/data-table';
import { Complaint } from '@/types/complaint';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function ComplaintsPage() {
  const [page] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useComplaints({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter || undefined,
    district: districtFilter || undefined,
    category: categoryFilter || undefined,
    sort: '-createdAt'
  });

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: (item: Complaint) => (
        <div className="font-medium max-w-[200px] sm:max-w-[300px] truncate" title={item.title}>
          {item.title}
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (item: Complaint) => (
        <span className="capitalize text-sm">{item.category}</span>
      ),
    },
    {
      header: 'Location',
      accessorKey: 'location',
      cell: (item: Complaint) => (
        <span className="text-sm">
          {item.location?.village}, {item.location?.district}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item: Complaint) => {
        const colors: Record<string, string> = {
          pending: 'bg-yellow-100 text-yellow-800',
          in_progress: 'bg-blue-100 text-blue-800',
          resolved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800',
        };
        const defaultColor = 'bg-gray-100 text-gray-800';
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colors[item.status] || defaultColor}`}>
            {item.status?.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: (item: Complaint) => (
        <span className="capitalize text-sm">{item.priority}</span>
      ),
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
          <Button variant="outline" className="h-8 px-3 text-xs bg-transparent border-primary/20 text-primary hover:bg-primary/5">
            View Details
          </Button>
        </Link>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Complaints</h2>
          <p className="text-muted-foreground">
            Manage and resolve public complaints with advanced filtering.
          </p>
        </div>
      </div>

      {/* Advanced Toolbar */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm border border-border">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search complaints by title or description..."
              className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className={`flex items-center gap-2 h-9 px-3 text-sm border bg-transparent text-foreground hover:bg-muted ${showFilters ? 'bg-muted' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {(statusFilter || districtFilter || categoryFilter) && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                !
              </span>
            )}
          </Button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t mt-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">Status</label>
              <select 
                className="w-full h-9 rounded-md border text-sm px-3 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">District</label>
              <select 
                className="w-full h-9 rounded-md border text-sm px-3 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                <option value="">All Districts</option>
                <option value="north">North District</option>
                <option value="south">South District</option>
                <option value="east">East District</option>
                <option value="west">West District</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Category</label>
              <select 
                className="w-full h-9 rounded-md border text-sm px-3 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="sanitation">Sanitation</option>
                <option value="water">Water Supply</option>
                <option value="electricity">Electricity</option>
              </select>
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <Button 
                variant="ghost" 
                className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground border-0 bg-transparent"
                onClick={() => {
                  setStatusFilter('');
                  setDistrictFilter('');
                  setCategoryFilter('');
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
    </div>
  );
}
