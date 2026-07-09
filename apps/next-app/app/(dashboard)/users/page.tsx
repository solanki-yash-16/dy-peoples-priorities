'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { useDeleteUser, useUpdateUser } from '@/hooks/use-users';
import { DataTable } from '@/components/shared/data-table';
import { User } from '@/types/auth';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const deleteUserMutation = useDeleteUser();
  
  const { data, isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: () => userService.getUsers(1, 10, search),
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const updateUserMutation = useUpdateUser();

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
          <button 
            className="text-sm font-medium text-primary hover:underline"
            onClick={() => setEditingUser(item)}
          >
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
    <div className="space-y-6 relative">
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

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl border border-border">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  value={editingUser.email}
                  disabled
                  title="Email cannot be changed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'user' | 'admin'})}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                className="rounded-md px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
              <button 
                className="rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                disabled={updateUserMutation.isPending}
                onClick={() => {
                  updateUserMutation.mutate({ 
                    id: editingUser._id, 
                    data: { name: editingUser.name, role: editingUser.role } 
                  }, {
                    onSuccess: () => setEditingUser(null)
                  });
                }}
              >
                {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
