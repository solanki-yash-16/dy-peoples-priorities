'use client';

import { useAuth } from '@/providers/auth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            View your personal information and account details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-border shadow-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold uppercase mb-4">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <CardTitle className="text-xl">{user?.name || 'Loading...'}</CardTitle>
            <CardDescription className="capitalize font-medium text-primary mt-1">
              {user?.role || 'Admin'}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="md:col-span-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Your current profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <User className="h-5 w-5" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-muted-foreground">Full Name</span>
                <span className="text-base text-foreground font-medium">{user?.name || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-muted-foreground">Email Address</span>
                <span className="text-base text-foreground font-medium">{user?.email || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-muted-foreground">Role / Permissions</span>
                <span className="text-base text-foreground font-medium capitalize">{user?.role || 'Admin'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-muted-foreground">Joined At</span>
                <span className="text-base text-foreground font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
