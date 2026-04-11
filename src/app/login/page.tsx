import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import LoginForm from './components/LoginForm';
import SocialProofSection from './components/SocialProofSection';
import FeatureHighlights from './components/FeatureHighlights';
import { getServerAuthenticatedUser } from '@/lib/auth/server';

export const metadata: Metadata = {
  title: 'Login - LinkLab',
  description: 'Sign in to your LinkLab account to access your dashboard, manage shortened links, and view detailed analytics for your URL campaigns.',
};

export default async function LoginPage() {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (authenticatedUser) {
    if (authenticatedUser.role === 'superadmin') {
      redirect('/admin');
    }
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticationAwareHeader isAuthenticated={false} />
      
      <main className="pt-[60px]">
        <div className="container mx-auto px-4 py-12">
          <LoginForm />
          <SocialProofSection />
          <FeatureHighlights />
        </div>
      </main>

      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} LinkLab. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a 
                href="/privacy-policy" 
                className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-250 ease-smooth"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-250 ease-smooth"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}