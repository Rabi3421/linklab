'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbNavigationProps {
  customItems?: BreadcrumbItem[];
}

const BreadcrumbNavigation = ({ customItems }: BreadcrumbNavigationProps) => {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = pathname.split('/').filter(segment => segment);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', path: '/dashboard' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      if (index > 0 || segment !== 'dashboard') {
        const label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        breadcrumbs.push({
          label,
          path: currentPath
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav 
      className="flex items-center gap-2 py-4 overflow-x-auto custom-scrollbar"
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <div key={item.path} className="flex items-center gap-2 flex-shrink-0">
            {index > 0 && (
              <Icon 
                name="ChevronRightIcon" 
                size={16} 
                variant="outline" 
                className="text-muted-foreground"
              />
            )}
            
            {isLast ? (
              <span className="font-body font-medium text-sm text-foreground">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.path}
                className="font-body font-medium text-sm text-muted-foreground transition-all duration-250 ease-smooth hover:text-primary hover:-translate-y-[1px]"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default BreadcrumbNavigation;