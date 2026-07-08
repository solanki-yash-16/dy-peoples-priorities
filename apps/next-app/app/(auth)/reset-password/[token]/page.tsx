'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Command, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    setApiError('');
    try {
      await authService.resetPassword(token, data.password);
      toast.success('Password reset successfully! You can now log in.');
      router.push('/login');
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setApiError(err.response?.data?.message || 'Failed to reset password. The token may be invalid or expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col space-y-8 w-full max-w-sm mx-auto"
    >
      <div className="flex flex-col space-y-3 text-center lg:text-left">
        <div className="flex justify-center lg:hidden mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
            <Command className="h-6 w-6" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Set new password</h1>
        <p className="text-sm text-muted-foreground">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {apiError && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 rounded-lg bg-destructive/15 p-4 text-sm font-medium text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{apiError}</p>
          </motion.div>
        )}

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>
              New Password
            </Label>
            <div className="relative">
              <Input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`h-11 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[0.8rem] font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className={errors.confirmPassword ? "text-destructive" : ""}>
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                {...register('confirmPassword')}
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className={`h-11 pr-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[0.8rem] font-medium text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <Button className="w-full h-11 text-base font-semibold shadow-md transition-all hover:shadow-lg active:scale-[0.98]" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Resetting password...
            </span>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </motion.div>
  );
}
