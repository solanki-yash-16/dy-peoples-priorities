'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { userService } from '@/services/user.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { Button } from '@repo/ui';
import { Input } from '@repo/ui';
import { Label } from '@repo/ui';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    
    setIsUpdatingName(true);
    try {
      await userService.updateUser(user._id, { name });
      toast.success('Profile updated successfully! Refreshing...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      // Assuming backend supports this route: PUT /v1/users/change-password
      // This is standard convention for settings pages.
      const { apiClient } = await import('@/lib/api-client');
      await apiClient.put('/v1/users/change-password', {
        currentPassword,
        newPassword
      });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and change your password.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>
              Update your basic profile information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="h-10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Read-only)</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="h-10 bg-muted/50 cursor-not-allowed"
                />
              </div>
              <Button type="submit" disabled={isUpdatingName || name === user?.name} className="mt-4">
                {isUpdatingName && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10"
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword} className="mt-4">
                {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
