'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { useDeleteUser } from '@/hooks/use-users';
import { DataTable } from '@/components/shared/data-table';
import { User } from '@/types/auth';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const deleteUserMutation = useDeleteUser();
  
  const { data, isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: () => userService.getUsers(1, 10, search),
  });

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (item: User) => (
        <div className="font-medium">{item.name}</div>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (item: User) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
          item.role === 'admin' 
            ? 'bg-primary/10 text-primary' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {item.role}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessorKey: '_id',
      cell: (item: User) => (
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-primary hover:underline">
            Edit
          </button>
          <button 
            className="text-sm font-medium text-destructive hover:underline disabled:opacity-50"
            disabled={deleteUserMutation.isPending}
            onClick={() => {
              if (confirm('Are you sure you want to delete this user?')) {
                deleteUserMutation.mutate(item._id);
              }
            }}
          >
            {deleteUserMutation.isPending ? '...' : 'Delete'}
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage your platform users and their roles.
          </p>
        </div>
      </div>

      <DataTable 
        data={data?.data || []} 
        columns={columns} 
        isLoading={isLoading}
        onSearch={setSearch}
        searchPlaceholder="Search users by name or email..."
      />
    </div>
  );
}
