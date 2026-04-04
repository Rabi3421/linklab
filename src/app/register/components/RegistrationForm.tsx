'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  submit?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const RegistrationForm = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: '',
    color: '',
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const existingEmails = [
    'john.doe@example.com',
    'jane.smith@example.com',
    'admin@linklab.com',
    'test@example.com',
  ];

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-destructive' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-warning' };
    if (score <= 4) return { score, label: 'Good', color: 'bg-accent' };
    return { score, label: 'Strong', color: 'bg-success' };
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    if (existingEmails.includes(email.toLowerCase())) {
      return 'This email is already registered. Please login instead.';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/\d/.test(password)) return 'Password must contain at least one number';
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return undefined;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'email' && typeof value === 'string') {
      const emailError = validateEmail(value);
      setErrors(prev => ({ ...prev, email: emailError }));
    }
    
    if (field === 'password' && typeof value === 'string') {
      const passwordError = validatePassword(value);
      setErrors(prev => ({ ...prev, password: passwordError }));
      setPasswordStrength(calculatePasswordStrength(value));
      
      if (formData.confirmPassword) {
        const confirmError = validateConfirmPassword(formData.confirmPassword, value);
        setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
      }
    }
    
    if (field === 'confirmPassword' && typeof value === 'string') {
      const confirmError = validateConfirmPassword(value, formData.password);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
    
    if (field === 'acceptTerms') {
      setErrors(prev => ({ ...prev, acceptTerms: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
    const termsError = !formData.acceptTerms ? 'You must accept the terms and conditions' : undefined;
    
    if (emailError || passwordError || confirmPasswordError || termsError) {
      setErrors({
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
        acceptTerms: termsError,
      });
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setRegistrationSuccess(true);
  };

  const handleResendVerification = () => {
    alert('Verification email has been resent to ' + formData.email);
  };

  if (!isHydrated) {
    return (
      <div className="w-full max-w-md mx-auto bg-card rounded-lg shadow-lg p-8">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="space-y-4">
            <div className="h-12 bg-muted rounded animate-pulse" />
            <div className="h-12 bg-muted rounded animate-pulse" />
            <div className="h-12 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (registrationSuccess) {
    return (
      <div className="w-full max-w-md mx-auto bg-card rounded-lg shadow-lg p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="CheckCircleIcon" size={32} variant="solid" className="text-success" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="font-heading font-semibold text-2xl text-foreground">
              Check Your Email
            </h2>
            <p className="font-body text-base text-muted-foreground">
              We've sent a verification link to
            </p>
            <p className="font-body font-medium text-base text-foreground">
              {formData.email}
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="font-body text-sm text-muted-foreground">
              Please click the verification link in your email to activate your account. The link will expire in 24 hours.
            </p>
            
            <button
              onClick={handleResendVerification}
              className="w-full font-body font-medium text-sm text-primary py-3 px-4 rounded-md border border-border transition-all duration-250 ease-smooth hover:bg-muted hover:-translate-y-[1px] active:scale-[0.97]"
            >
              Resend Verification Email
            </button>
            
            <Link
              href="/login"
              className="block w-full font-body font-medium text-sm text-primary-foreground bg-primary py-3 px-4 rounded-md shadow-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-[0.97] text-center"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-lg shadow-lg p-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading font-semibold text-3xl text-foreground">
            Create Your Account
          </h1>
          <p className="font-body text-base text-muted-foreground">
            Start shortening and tracking your links today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="font-body font-medium text-sm text-foreground block">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full font-body text-base text-foreground bg-background border ${
                  errors.email ? 'border-destructive' : 'border-input'
                } rounded-md px-4 py-3 pr-10 transition-all duration-250 ease-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent`}
                placeholder="you@example.com"
                disabled={isSubmitting}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {formData.email && !errors.email && (
                  <Icon name="CheckCircleIcon" size={20} variant="solid" className="text-success" />
                )}
                {errors.email && (
                  <Icon name="ExclamationCircleIcon" size={20} variant="solid" className="text-destructive" />
                )}
              </div>
            </div>
            {errors.email && (
              <p className="font-body text-sm text-destructive flex items-center gap-1">
                <Icon name="ExclamationTriangleIcon" size={16} variant="solid" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="font-body font-medium text-sm text-foreground block">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full font-body text-base text-foreground bg-background border ${
                  errors.password ? 'border-destructive' : 'border-input'
                } rounded-md px-4 py-3 pr-10 transition-all duration-250 ease-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent`}
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-250"
              >
                <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} variant="outline" />
              </button>
            </div>
            
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-350 ease-smooth`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="font-caption text-xs text-muted-foreground">
                    {passwordStrength.label}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="font-caption text-xs text-muted-foreground">Password must contain:</p>
                  <ul className="space-y-1">
                    <li className={`font-caption text-xs flex items-center gap-1 ${
                      formData.password.length >= 8 ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      <Icon 
                        name={formData.password.length >= 8 ? 'CheckCircleIcon' : 'XCircleIcon'} 
                        size={14} 
                        variant="solid" 
                      />
                      At least 8 characters
                    </li>
                    <li className={`font-caption text-xs flex items-center gap-1 ${
                      /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      <Icon 
                        name={/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? 'CheckCircleIcon' : 'XCircleIcon'} 
                        size={14} 
                        variant="solid" 
                      />
                      Uppercase and lowercase letters
                    </li>
                    <li className={`font-caption text-xs flex items-center gap-1 ${
                      /\d/.test(formData.password) ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      <Icon 
                        name={/\d/.test(formData.password) ? 'CheckCircleIcon' : 'XCircleIcon'} 
                        size={14} 
                        variant="solid" 
                      />
                      At least one number
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="font-body text-sm text-destructive flex items-center gap-1">
                <Icon name="ExclamationTriangleIcon" size={16} variant="solid" />
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="font-body font-medium text-sm text-foreground block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full font-body text-base text-foreground bg-background border ${
                  errors.confirmPassword ? 'border-destructive' : 'border-input'
                } rounded-md px-4 py-3 pr-10 transition-all duration-250 ease-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent`}
                placeholder="Confirm your password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-250"
              >
                <Icon name={showConfirmPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} variant="outline" />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="font-body text-sm text-destructive flex items-center gap-1">
                <Icon name="ExclamationTriangleIcon" size={16} variant="solid" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                className="mt-1 w-4 h-4 text-primary bg-background border-input rounded transition-all duration-250 ease-smooth focus:ring-2 focus:ring-ring cursor-pointer"
                disabled={isSubmitting}
              />
              <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-250">
                I agree to the{' '}
                <Link href="/terms-of-service" className="text-primary hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="font-body text-sm text-destructive flex items-center gap-1">
                <Icon name="ExclamationTriangleIcon" size={16} variant="solid" />
                {errors.acceptTerms}
              </p>
            )}
          </div>

          {errors.submit && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
              <p className="font-body text-sm text-destructive flex items-center gap-2">
                <Icon name="ExclamationCircleIcon" size={20} variant="solid" />
                {errors.submit}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-body font-medium text-base text-primary-foreground bg-primary py-3 px-4 rounded-md shadow-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Icon name="ArrowPathIcon" size={20} variant="outline" className="animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <Icon name="UserPlusIcon" size={20} variant="outline" />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card font-body text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>

        <Link
          href="/login"
          className="block w-full font-body font-medium text-base text-foreground py-3 px-4 rounded-md border border-border transition-all duration-250 ease-smooth hover:bg-muted hover:-translate-y-[1px] active:scale-[0.97] text-center"
        >
          Sign In Instead
        </Link>
      </div>
    </div>
  );
};

export default RegistrationForm;