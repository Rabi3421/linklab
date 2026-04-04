'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface LoginFormProps {
  onSubmit?: (email: string, password: string, rememberMe: boolean) => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return undefined;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    setErrors(prev => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    setErrors(prev => ({ ...prev, password: validatePassword(password) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched({ email: true, password: true });
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockCredentials = {
        email: 'demo@linklab.com',
        password: 'Demo@123'
      };

      if (email === mockCredentials.email && password === mockCredentials.password) {
        if (onSubmit) {
          onSubmit(email, password, rememberMe);
        }
        router.push('/dashboard');
      } else {
        setErrors({
          general: 'Invalid email or password. Please use demo@linklab.com / Demo@123'
        });
      }
    } catch (error) {
      setErrors({
        general: 'An error occurred during login. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="font-body text-base text-muted-foreground">
            Sign in to access your dashboard and manage your links
          </p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-3">
            <Icon name="ExclamationCircleIcon" size={20} variant="solid" className="text-destructive flex-shrink-0 mt-0.5" />
            <p className="font-body text-sm text-destructive">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block font-body font-medium text-sm text-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                disabled={isLoading}
                className={`w-full px-4 py-3 pl-11 font-body text-base bg-background border rounded-md transition-all duration-250 ease-smooth focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.email && touched.email
                    ? 'border-destructive focus:ring-destructive' :'border-input focus:border-primary'
                }`}
                placeholder="demo@linklab.com"
                autoComplete="email"
              />
              <Icon 
                name="EnvelopeIcon" 
                size={20} 
                variant="outline" 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
            {errors.email && touched.email && (
              <p className="mt-2 font-body text-sm text-destructive flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} variant="solid" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block font-body font-medium text-sm text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                disabled={isLoading}
                className={`w-full px-4 py-3 pl-11 pr-11 font-body text-base bg-background border rounded-md transition-all duration-250 ease-smooth focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.password && touched.password
                    ? 'border-destructive focus:ring-destructive' :'border-input focus:border-primary'
                }`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <Icon 
                name="LockClosedIcon" 
                size={20} 
                variant="outline" 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-250 ease-smooth disabled:opacity-50"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <Icon 
                  name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} 
                  size={20} 
                  variant="outline"
                />
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="mt-2 font-body text-sm text-destructive flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} variant="solid" />
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring transition-all duration-250 ease-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="font-body text-sm text-foreground select-none">
                Remember me
              </span>
            </label>

            <Link
              href="/forgot-password"
              className="font-body text-sm text-primary hover:text-primary/80 transition-colors duration-250 ease-smooth"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground font-body font-semibold text-base py-3 px-6 rounded-md shadow-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Icon name="ArrowPathIcon" size={20} variant="outline" className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <Icon name="ArrowRightIcon" size={20} variant="outline" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center font-body text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-primary font-medium hover:text-primary/80 transition-colors duration-250 ease-smooth"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;