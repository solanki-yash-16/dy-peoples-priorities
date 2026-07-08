'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, AlertCircle, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Complaints', href: '/complaints', icon: AlertCircle },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground shadow-sm">
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <h1 className="text-lg font-semibold tracking-tight">Admin Dashboard</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          // exact match for overview
          const active = item.href === '/' ? pathname === '/' : isActive;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
              )}
            >
              <item.icon
                className={cn(
                  active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                  'mr-3 h-5 w-5 flex-shrink-0 transition-colors'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4 flex flex-col gap-2">
        <div className="flex items-center gap-3 rounded-md p-2">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">{user?.name || 'Loading...'}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email || ''}</span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 rounded-md p-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
