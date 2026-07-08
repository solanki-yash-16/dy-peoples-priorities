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
    <div className="space-y-4">
      {onSearch && (
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-muted">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
      )}

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-4 py-3 font-medium border-b">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0 animate-pulse">
                    {columns.map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
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
                  <tr key={rowIndex} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="px-4 py-3 align-middle">
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
        <div className="flex items-center justify-between border-t px-4 py-3 bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(10, data.length)}</span> of <span className="font-medium">{data.length}</span> results
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded-md border bg-background disabled:opacity-50" disabled>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-1 rounded-md border bg-background disabled:opacity-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
