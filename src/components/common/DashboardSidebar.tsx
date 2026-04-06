'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarItem {
  label: string;
  path: string;
  icon: string;
  tooltip?: string;
}

interface DashboardSidebarProps {
  isCollapsed?: boolean;
}

const DashboardSidebar = ({ isCollapsed = false }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const sidebarItems: SidebarItem[] = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: 'HomeIcon',
      tooltip: 'View your dashboard overview'
    },
    { 
      label: 'Link Analytics', 
      path: '/link-analytics', 
      icon: 'ChartBarIcon',
      tooltip: 'Analyze link performance'
    },
    { 
      label: 'Create Link', 
      path: '/create-link', 
      icon: 'PlusCircleIcon',
      tooltip: 'Create a new short link'
    },
    { 
      label: 'My Links', 
      path: '/my-links', 
      icon: 'LinkIcon',
      tooltip: 'Manage all your links'
    },
    { 
      label: 'Settings', 
      path: '/settings', 
      icon: 'Cog6ToothIcon',
      tooltip: 'Account settings'
    },
  ];

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <aside 
        className={`hidden lg:fixed lg:flex flex-col top-[72px] left-0 bottom-0 bg-card border-r border-border transition-all duration-350 ease-smooth z-50 ${
          collapsed ? 'w-[84px]' : 'w-[240px]'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <span className="font-heading font-semibold text-base text-foreground">Navigation</span>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-md transition-all duration-250 ease-smooth hover:bg-muted active:scale-[0.97]"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon 
              name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'} 
              size={20} 
              variant="outline" 
            />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div className="flex flex-col gap-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                title={collapsed ? item.tooltip : undefined}
                className={`flex items-center gap-3 font-body font-medium text-sm rounded-md transition-all duration-250 ease-smooth hover:bg-muted hover:-translate-y-[1px] ${
                  isActivePath(item.path) 
                    ? 'text-primary bg-muted shadow-sm' 
                    : 'text-foreground'
                } ${collapsed ? 'justify-center px-2 py-3 min-h-[56px]' : 'px-4 py-3'}`}
              >
                <span
                  className={`flex items-center justify-center rounded-xl transition-all duration-250 ${
                    collapsed
                      ? isActivePath(item.path)
                        ? 'h-11 w-11 bg-primary/14'
                        : 'h-11 w-11 bg-muted/60'
                      : 'h-9 w-9'
                  }`}
                >
                  <Icon name={item.icon as any} size={collapsed ? 22 : 20} variant="outline" />
                </span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 font-body font-medium text-sm text-foreground rounded-md transition-all duration-250 ease-smooth hover:bg-muted hover:-translate-y-[1px] ${
              collapsed ? 'justify-center px-2 py-3 min-h-[56px]' : 'px-4 py-3'
            }`}
            title={collapsed ? 'Logout' : undefined}
          >
            <span className={`flex items-center justify-center rounded-xl ${collapsed ? 'h-11 w-11 bg-muted/60' : 'h-9 w-9'}`}>
              <Icon name="ArrowRightOnRectangleIcon" size={collapsed ? 22 : 20} variant="outline" />
            </span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-100 shadow-lg">
        <div className="flex items-center justify-around py-2">
          {sidebarItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-md transition-all duration-250 ease-smooth active:scale-[0.97] ${
                isActivePath(item.path) 
                  ? 'text-primary' :'text-foreground'
              }`}
            >
              <Icon name={item.icon as any} size={24} variant="outline" />
              <span className="font-caption text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default DashboardSidebar;