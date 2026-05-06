import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import RegistrationForm from './components/RegistrationForm';
import { getServerAuthenticatedUser } from '@/lib/auth/server';

export const metadata: Metadata = {
  title: 'Create Account - LinkLab',
  description: 'Sign up for LinkLab to start shortening URLs, tracking link analytics, and managing your link portfolio with our comprehensive URL shortener platform.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RegisterPage() {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (authenticatedUser) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticationAwareHeader isAuthenticated={false} />
      
      <main className="pt-[60px] pb-16">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center justify-center min-h-[calc(100vh-60px-64px)]">
            <RegistrationForm />
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} LinkLab. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="/privacy-policy"
                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-250"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-of-service"
                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-250"
              >
                Terms of Service
              </a>
              <a
                href="/contact"
                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-250"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
