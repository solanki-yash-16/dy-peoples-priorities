'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, Menu } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

export function Navbar() {
  const pathname = usePathname();
  
  // Create simple breadcrumb from pathname
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumb = segments.length > 0 
    ? segments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ')
    : 'Overview';

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-muted-foreground lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center gap-2">
          <h2 className="text-sm font-medium text-muted-foreground hidden sm:block">
            Dashboard / <span className="text-foreground font-semibold">{breadcrumb}</span>
          </h2>
          
          <form className="relative flex flex-1 ml-auto max-w-md hidden md:flex" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block h-10 w-full rounded-md border border-input bg-transparent py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search..."
              type="search"
              name="search"
            />
          </form>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <ThemeSwitcher />
          <button type="button" className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
