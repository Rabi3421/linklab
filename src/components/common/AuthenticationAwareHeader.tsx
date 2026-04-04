'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface NavigationItem {
  label: string;
  path: string;
  requiresAuth: boolean;
}

interface AuthenticationAwareHeaderProps {
  isAuthenticated?: boolean;
}

const AuthenticationAwareHeader = ({ isAuthenticated = false }: AuthenticationAwareHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const publicNavItems: NavigationItem[] = [
    { label: 'About', path: '/about', requiresAuth: false },
    { label: 'Pricing', path: '/pricing', requiresAuth: false },
    { label: 'Developers', path: '/developers', requiresAuth: false },
    { label: 'Blog', path: '/blog', requiresAuth: false },
  ];

  const authenticatedNavItems: NavigationItem[] = [
    { label: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { label: 'Analytics', path: '/link-analytics', requiresAuth: true },
  ];

  const navigationItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[120] shadow-md backdrop-blur-xl"
      style={{
        background: 'rgba(37,40,48,0.92)',
        borderBottom: '1px solid rgba(200,205,220,0.12)',
      }}
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between h-[60px] px-4">
          <Link 
            href={isAuthenticated ? '/dashboard' : '/homepage'} 
            className="flex items-center gap-3 transition-transform duration-250 ease-smooth hover:scale-105"
            onClick={closeMobileMenu}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="8" fill="var(--color-primary)" />
              <path d="M12 18L16 22L24 14" stroke="var(--color-primary-foreground)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 10V26M10 18H26" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="font-heading font-semibold text-xl text-foreground">LinkLab</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`font-body font-medium text-base transition-all duration-250 ease-smooth hover:text-primary hover:-translate-y-[1px] ${
                  isActivePath(item.path) 
                    ? 'text-primary border-b-2 border-primary' :'text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="font-body font-medium text-base text-foreground px-6 py-2 rounded-md transition-all duration-250 ease-smooth hover:bg-muted hover:-translate-y-[1px]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="font-body font-medium text-base text-primary-foreground bg-primary px-6 py-2 rounded-md shadow-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-[0.97]"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <button
                onClick={() => {}}
                className="font-body font-medium text-base text-foreground px-6 py-2 rounded-md transition-all duration-250 ease-smooth hover:bg-muted hover:-translate-y-[1px] flex items-center gap-2"
              >
                <Icon name="UserCircleIcon" size={20} variant="outline" />
                Account
              </button>
            )}
          </div>

          <button
            onClick={handleMobileMenuToggle}
            className="lg:hidden p-2 rounded-md transition-all duration-250 ease-smooth hover:bg-muted active:scale-[0.97]"
            aria-label="Toggle mobile menu"
          >
            <Icon 
              name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} 
              size={24} 
              variant="outline" 
            />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 top-[60px] bg-background z-[130] lg:hidden"
          onClick={closeMobileMenu}
        >
          <nav className="flex flex-col p-6 gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeMobileMenu}
                className={`font-body font-medium text-base py-3 px-4 rounded-md transition-all duration-250 ease-smooth hover:bg-muted ${
                  isActivePath(item.path) 
                    ? 'text-primary bg-muted' :'text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="font-body font-medium text-base text-foreground py-3 px-4 rounded-md transition-all duration-250 ease-smooth hover:bg-muted text-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="font-body font-medium text-base text-primary-foreground bg-primary py-3 px-4 rounded-md shadow-sm transition-all duration-250 ease-smooth hover:shadow-md active:scale-[0.97] text-center"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    closeMobileMenu();
                  }}
                  className="font-body font-medium text-base text-foreground py-3 px-4 rounded-md transition-all duration-250 ease-smooth hover:bg-muted flex items-center justify-center gap-2"
                >
                  <Icon name="UserCircleIcon" size={20} variant="outline" />
                  Account
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AuthenticationAwareHeader;