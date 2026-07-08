'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Command, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@repo/ui';
import { Input } from '@repo/ui';
import { Label } from '@repo/ui';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerAuth } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setApiError('');
    try {
      await registerAuth({ name: data.name, email: data.email, password: data.password });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setApiError(err.response?.data?.message || 'Failed to create account. Please try again.');
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Command className="h-6 w-6" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to set up your administrator access
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
            <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
              Full Name
            </Label>
            <Input
              {...register('name')}
              id="name"
              type="text"
              placeholder="John Doe"
              disabled={isSubmitting}
              className={`h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.name && (
              <p className="text-[0.8rem] font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
              Email address
            </Label>
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="name@example.com"
              disabled={isSubmitting}
              className={`h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.email && (
              <p className="text-[0.8rem] font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>
                Password
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
                Confirm Password
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
        </div>

        <Button className="w-full h-11 text-base font-semibold shadow-md transition-all hover:shadow-lg active:scale-[0.98]" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
