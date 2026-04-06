'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated: isAuthenticatedFromContext, signOut, user } = useAuth();
  const showsAuthenticatedNavigation = isAuthenticated;
  const hasAuthenticatedSession = isAuthenticatedFromContext;
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

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

  const profileMenuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'Squares2X2Icon',
      description: 'View your links and recent activity',
    },
    {
      label: 'Analytics',
      path: '/link-analytics',
      icon: 'ChartBarIcon',
      description: 'Track clicks, regions, and devices',
    },
    {
      label: 'Blog',
      path: '/blog',
      icon: 'DocumentTextIcon',
      description: 'Read growth and attribution guides',
    },
    {
      label: 'Developers',
      path: '/developers',
      icon: 'CodeBracketIcon',
      description: 'Explore docs and API guidance',
    },
  ];

  const navigationItems = showsAuthenticatedNavigation ? authenticatedNavItems : publicNavItems;

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

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileMenuOpen]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleProfileNavigation = (path: string) => {
    setIsProfileMenuOpen(false);
    closeMobileMenu();
    router.push(path);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsProfileMenuOpen(false);
    closeMobileMenu();
    router.push('/');
    router.refresh();
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
            href={showsAuthenticatedNavigation ? '/dashboard' : '/'} 
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
            {!hasAuthenticatedSession ? (
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
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen((previousState) => !previousState)}
                  className="flex items-center gap-3 rounded-full border border-[rgba(200,205,220,0.12)] bg-white/[0.04] py-2 pl-2 pr-4 text-foreground transition-all duration-250 ease-smooth hover:bg-white/[0.07]"
                  aria-label="Open profile menu"
                  aria-expanded={isProfileMenuOpen}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-semibold text-white">
                    {(user?.email?.[0] ?? 'U').toUpperCase()}
                  </span>
                  <span className="max-w-[180px] truncate text-sm font-medium text-white/88">
                    {user?.email ?? 'Your account'}
                  </span>
                  <Icon
                    name={isProfileMenuOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                    size={18}
                    variant="outline"
                    className="text-white/60"
                  />
                </button>

                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+12px)] w-[320px] rounded-[24px] border border-[rgba(200,205,220,0.12)] bg-[#2a2d36]/95 p-3 shadow-xl backdrop-blur-2xl"
                    style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.32)' }}
                  >
                    <div className="rounded-[18px] border border-[rgba(200,205,220,0.10)] bg-white/[0.03] px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/75">Signed in as</p>
                      <p className="mt-2 text-sm font-medium text-white/92 break-all">{user?.email}</p>
                      <p className="mt-1 text-sm text-white/50">
                        {showsAuthenticatedNavigation ? 'Manage your workspace and analytics from one place.' : 'Open your workspace or jump to key LinkLab sections.'}
                      </p>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      {profileMenuItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => handleProfileNavigation(item.path)}
                          className="flex w-full items-start gap-3 rounded-[18px] px-3 py-3 text-left transition-all duration-250 ease-smooth hover:bg-white/[0.05]"
                        >
                          <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05] text-amber-300">
                            <Icon name={item.icon} size={20} variant="outline" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-white/90">{item.label}</span>
                            <span className="block text-xs leading-relaxed text-white/48">{item.description}</span>
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="my-3 h-px bg-[rgba(200,205,220,0.10)]" />

                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center justify-between rounded-[18px] px-3 py-3 text-left transition-all duration-250 ease-smooth hover:bg-red-500/[0.08]"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/[0.08] text-red-300">
                          <Icon name="ArrowRightOnRectangleIcon" size={20} variant="outline" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-white/90">Logout</span>
                          <span className="block text-xs text-white/48">End this session securely</span>
                        </span>
                      </span>
                      <Icon name="ChevronRightIcon" size={18} variant="outline" className="text-white/35" />
                    </button>
                  </div>
                )}
              </div>
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
              {!hasAuthenticatedSession ? (
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
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleProfileNavigation('/dashboard')}
                    className="font-body font-medium text-base text-foreground py-3 px-4 rounded-md transition-all duration-250 ease-smooth hover:bg-muted flex items-center justify-center gap-2"
                  >
                    <Icon name="UserCircleIcon" size={20} variant="outline" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleProfileNavigation('/link-analytics')}
                    className="font-body font-medium text-base text-foreground py-3 px-4 rounded-md transition-all duration-250 ease-smooth hover:bg-muted flex items-center justify-center gap-2"
                  >
                    <Icon name="ChartBarIcon" size={20} variant="outline" />
                    Analytics
                  </button>
                  <button
                    onClick={() => handleProfileNavigation('/developers')}
                    className="font-body font-medium text-base text-foreground py-3 px-4 rounded-md transition-all duration-250 ease-smooth hover:bg-muted flex items-center justify-center gap-2"
                  >
                    <Icon name="CodeBracketIcon" size={20} variant="outline" />
                    Developers
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="font-body font-medium text-base text-foreground py-3 px-4 rounded-md transition-all duration-250 ease-smooth hover:bg-muted flex items-center justify-center gap-2 border border-border"
                  >
                    <Icon name="ArrowRightOnRectangleIcon" size={20} variant="outline" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AuthenticationAwareHeader;