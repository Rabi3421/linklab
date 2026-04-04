'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
}

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
}

const MobileNavigationDrawer = ({ 
  isOpen, 
  onClose, 
  isAuthenticated = false 
}: MobileNavigationDrawerProps) => {
  const pathname = usePathname();

  const publicNavItems: NavigationItem[] = [
    { label: 'About', path: '/about', icon: 'InformationCircleIcon' },
    { label: 'Pricing', path: '/pricing', icon: 'CurrencyDollarIcon' },
    { label: 'Developers', path: '/developers', icon: 'CodeBracketIcon' },
    { label: 'Blog', path: '/blog', icon: 'DocumentTextIcon' },
  ];

  const authenticatedNavItems: NavigationItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'HomeIcon' },
    { label: 'Analytics', path: '/link-analytics', icon: 'ChartBarIcon' },
  ];

  const navigationItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-background z-150 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        className="fixed inset-y-0 left-0 w-[280px] bg-card shadow-xl z-200 lg:hidden transform transition-transform duration-350 ease-smooth"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link 
              href={isAuthenticated ? '/dashboard' : '/homepage'} 
              className="flex items-center gap-3"
              onClick={onClose}
            >
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="8" fill="var(--color-primary)" />
                <path d="M12 18L16 22L24 14" stroke="var(--color-primary-foreground)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 10V26M10 18H26" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="font-heading font-semibold text-lg text-foreground">LinkLab</span>
            </Link>
            
            <button
              onClick={onClose}
              className="p-2 rounded-md transition-all duration-250 ease-smooth hover:bg-muted active:scale-[0.97]"
              aria-label="Close menu"
            >
              <Icon name="XMarkIcon" size={24} variant="outline" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 font-body font-medium text-base py-3 px-4 rounded-md transition-all duration-250 ease-smooth hover:bg-muted ${
                    isActivePath(item.path) 
                      ? 'text-primary bg-muted' :'text-foreground'
                  }`}
                >
                  <Icon name={item.icon as any} size={20} variant="outline" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-6 border-t border-border">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="font-body font-medium text-base text-foreground py-3 px-4 rounded-md transition-all duration-250 ease-smooth hover:bg-muted text-center border border-border"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="font-body font-medium text-base text-primary-foreground bg-primary py-3 px-4 rounded-md shadow-sm transition-all duration-250 ease-smooth hover:shadow-md active:scale-[0.97] text-center"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                }}
                className="w-full font-body font-medium text-base text-foreground py-3 px-4 rounded-md transition-all duration-250 ease-smooth hover:bg-muted flex items-center justify-center gap-2"
              >
                <Icon name="UserCircleIcon" size={20} variant="outline" />
                Account
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigationDrawer;