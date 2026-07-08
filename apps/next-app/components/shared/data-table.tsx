'use client';

import * as React from 'react';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export function DataTable<T>({ 
  data, 
  columns, 
  isLoading,
  onSearch,
  searchPlaceholder = 'Search...'
}: DataTableProps<T>) {
  
  return (
    <div className="space-y-4 w-full">
      {onSearch && (
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-muted/40 text-muted-foreground sticky top-0 z-10">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b border-border">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((_, j) => (
                      <td key={j} className="px-6 py-5">
                        <div className="h-4 bg-muted/60 rounded w-3/4"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                    No results found.
                  </td>
                </tr>
              ) : (
                data.map((item, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-muted/50 transition-colors text-foreground group">
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 align-middle text-sm font-medium">
                        {col.cell 
                          ? col.cell(item) 
                          : String((item as Record<string, unknown>)[col.accessorKey as string] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Simple pagination */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{data.length > 0 ? 1 : 0}</span> to <span className="font-medium text-foreground">{Math.min(10, data.length)}</span> of <span className="font-medium text-foreground">{data.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={data.length < 10}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
