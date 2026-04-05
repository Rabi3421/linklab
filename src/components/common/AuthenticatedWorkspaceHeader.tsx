'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

interface AuthenticatedWorkspaceHeaderProps {
  title: string;
  description?: string;
}

interface WorkspaceCommand {
  label: string;
  description: string;
  path: string;
  icon: string;
  keywords: string[];
  contextLabel?: 'Current' | 'Recent';
}

interface WorkspaceNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  tone: 'info' | 'success' | 'warning';
}

const commandCatalog: WorkspaceCommand[] = [
  {
    label: 'Create link',
    description: 'Launch a new short link and branded QR code.',
    path: '/create-link',
    icon: 'PlusCircleIcon',
    keywords: ['new', 'shorten', 'qr', 'campaign'],
  },
  {
    label: 'Dashboard overview',
    description: 'Review your top-performing links and recent activity.',
    path: '/dashboard',
    icon: 'HomeIcon',
    keywords: ['home', 'overview', 'stats'],
  },
  {
    label: 'Link analytics',
    description: 'Inspect clicks, referrers, locations, and devices.',
    path: '/link-analytics',
    icon: 'ChartBarIcon',
    keywords: ['report', 'insights', 'traffic'],
  },
  {
    label: 'My links',
    description: 'Search, edit, and download QR codes for all links.',
    path: '/my-links',
    icon: 'LinkIcon',
    keywords: ['manage', 'library', 'urls'],
  },
  {
    label: 'Settings',
    description: 'Update workspace profile and notification preferences.',
    path: '/settings',
    icon: 'Cog6ToothIcon',
    keywords: ['profile', 'notifications', 'preferences'],
  },
  {
    label: 'Developer docs',
    description: 'Open the developer documentation and API guidance.',
    path: '/developers',
    icon: 'CodeBracketIcon',
    keywords: ['docs', 'api', 'developer'],
  },
];

const initialNotifications: WorkspaceNotification[] = [
  {
    id: '1',
    title: 'Traffic spike detected',
    body: 'Your top campaign link is up 24% compared with the previous 24 hours.',
    time: '5 min ago',
    unread: true,
    tone: 'success',
  },
  {
    id: '2',
    title: 'New QR download ready',
    body: 'Styled QR exports are now optimized for PNG downloads across the workspace.',
    time: '18 min ago',
    unread: true,
    tone: 'info',
  },
  {
    id: '3',
    title: 'Workspace tip',
    body: 'Use expiring links for limited-time launches and promo campaigns.',
    time: 'Today',
    unread: false,
    tone: 'warning',
  },
];

const toneClasses: Record<WorkspaceNotification['tone'], string> = {
  info: 'bg-sky-500/12 text-sky-300',
  success: 'bg-emerald-500/12 text-emerald-300',
  warning: 'bg-amber-500/12 text-amber-300',
};

const overlayPanelClass =
  'rounded-2xl border border-border/80 bg-[#2c303a] shadow-[0_24px_70px_rgba(0,0,0,0.55)] ring-1 ring-black/10';

const RECENT_DESTINATIONS_STORAGE_KEY = 'linklab:recent-workspace-destinations';
const MAX_RECENT_DESTINATIONS = 5;

const fallbackIconByPath: Array<{ match: string; icon: string }> = [
  { match: '/dashboard', icon: 'HomeIcon' },
  { match: '/link-analytics', icon: 'ChartBarIcon' },
  { match: '/my-links', icon: 'LinkIcon' },
  { match: '/create-link', icon: 'PlusCircleIcon' },
  { match: '/settings', icon: 'Cog6ToothIcon' },
  { match: '/developers', icon: 'CodeBracketIcon' },
  { match: '/blog', icon: 'DocumentTextIcon' },
];

function getCommandIconForPath(path: string) {
  return fallbackIconByPath.find((item) => path.startsWith(item.match))?.icon ?? 'Squares2X2Icon';
}

export default function AuthenticatedWorkspaceHeader({
  title,
  description,
}: AuthenticatedWorkspaceHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [commandQuery, setCommandQuery] = useState('');
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [recentDestinationPaths, setRecentDestinationPaths] = useState<string[]>([]);
  const commandMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileCommandMenuRef = useRef<HTMLDivElement | null>(null);
  const desktopCommandInputRef = useRef<HTMLInputElement | null>(null);
  const mobileCommandInputRef = useRef<HTMLInputElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const quickActionsRef = useRef<HTMLDivElement | null>(null);
  const helpRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);

  const commandLookup = useMemo(
    () => new Map(commandCatalog.map((command) => [command.path, command])),
    []
  );

  const contextualCommands = useMemo(() => {
    const knownCommand = commandLookup.get(pathname);

    if (knownCommand) {
      return [{ ...knownCommand, contextLabel: 'Current' as const }];
    }

    return [
      {
        label: title,
        description: description || 'Return to the current workspace page.',
        path: pathname,
        icon: getCommandIconForPath(pathname),
        keywords: [title.toLowerCase(), pathname.replaceAll('/', ' ')],
        contextLabel: 'Current' as const,
      },
    ];
  }, [commandLookup, description, pathname, title]);

  const recentCommands = useMemo(() => {
    return recentDestinationPaths
      .filter((path) => path !== pathname)
      .map((path) => {
        const knownCommand = commandLookup.get(path);

        if (knownCommand) {
          return { ...knownCommand, contextLabel: 'Recent' as const };
        }

        return {
          label:
            path === '/homepage'
              ? 'Homepage'
              : path.split('/').filter(Boolean).join(' / ') || 'Home',
          description: 'Return to a recently visited workspace destination.',
          path,
          icon: getCommandIconForPath(path),
          keywords: [path.replaceAll('/', ' '), 'recent', 'history'],
          contextLabel: 'Recent' as const,
        };
      });
  }, [commandLookup, pathname, recentDestinationPaths]);

  const availableCommands = useMemo(() => {
    const uniqueCommands = new Map<string, WorkspaceCommand>();

    [...contextualCommands, ...recentCommands, ...commandCatalog].forEach((command) => {
      if (!uniqueCommands.has(command.path)) {
        uniqueCommands.set(command.path, command);
      }
    });

    return Array.from(uniqueCommands.values());
  }, [contextualCommands, recentCommands]);

  const filteredCommands = useMemo(() => {
    const query = commandQuery.trim().toLowerCase();

    if (!query) {
      return availableCommands;
    }

    return availableCommands.filter((command) => {
      const haystack = [command.label, command.description, ...command.keywords]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [availableCommands, commandQuery]);

  const unreadNotifications = notifications.filter((item) => item.unread).length;
  const userInitial = (user?.email?.[0] ?? 'U').toUpperCase();
  const helpItems = [
    {
      label: 'Developers',
      path: '/developers',
      description: 'API docs, implementation guides, and examples.',
      icon: 'CodeBracketIcon',
    },
    {
      label: 'Blog',
      path: '/blog',
      description: 'Growth, analytics, and campaign playbooks.',
      icon: 'DocumentTextIcon',
    },
    {
      label: 'Settings',
      path: '/settings',
      description: 'Manage notifications, workspace, and security.',
      icon: 'Cog6ToothIcon',
    },
  ];
  const quickActionItems = [
    {
      label: 'New short link',
      path: '/create-link',
      description: 'Create a new link or QR campaign.',
      icon: 'PlusCircleIcon',
    },
    {
      label: 'Open analytics',
      path: '/link-analytics',
      description: 'Review the latest click activity.',
      icon: 'ChartBarIcon',
    },
    {
      label: 'Manage links',
      path: '/my-links',
      description: 'Edit, share, or expire existing links.',
      icon: 'LinkIcon',
    },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedDestinations = window.localStorage.getItem(RECENT_DESTINATIONS_STORAGE_KEY);

      if (!storedDestinations) {
        return;
      }

      const parsedDestinations = JSON.parse(storedDestinations) as unknown;

      if (Array.isArray(parsedDestinations)) {
        setRecentDestinationPaths(
          parsedDestinations.filter((item): item is string => typeof item === 'string')
        );
      }
    } catch {
      setRecentDestinationPaths([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) {
      return;
    }

    setRecentDestinationPaths((currentPaths) => {
      const nextPaths = [pathname, ...currentPaths.filter((path) => path !== pathname)].slice(
        0,
        MAX_RECENT_DESTINATIONS
      );

      window.localStorage.setItem(RECENT_DESTINATIONS_STORAGE_KEY, JSON.stringify(nextPaths));

      return nextPaths;
    });
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        !commandMenuRef.current?.contains(target) &&
        !mobileCommandMenuRef.current?.contains(target)
      ) {
        setIsCommandMenuOpen(false);
      }
      if (!notificationsRef.current?.contains(target)) {
        setIsNotificationsOpen(false);
      }
      if (!quickActionsRef.current?.contains(target)) {
        setIsQuickActionsOpen(false);
      }
      if (!helpRef.current?.contains(target)) {
        setIsHelpOpen(false);
      }
      if (!profileRef.current?.contains(target)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openCommandPalette();
      }

      if (event.key === 'Escape') {
        closeAllMenus();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyboardShortcuts);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, []);

  useEffect(() => {
    setIsCommandMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsQuickActionsOpen(false);
    setIsHelpOpen(false);
    setIsProfileMenuOpen(false);
    setCommandQuery('');
    setActiveCommandIndex(0);
  }, [pathname]);

  useEffect(() => {
    setActiveCommandIndex(0);
  }, [commandQuery]);

  useEffect(() => {
    if (!isCommandMenuOpen) {
      return;
    }

    const focusTarget =
      typeof window !== 'undefined' && window.innerWidth >= 1024
        ? desktopCommandInputRef.current
        : mobileCommandInputRef.current;

    focusTarget?.focus();
  }, [isCommandMenuOpen]);

  const closeAllMenus = () => {
    setIsCommandMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsQuickActionsOpen(false);
    setIsHelpOpen(false);
    setIsProfileMenuOpen(false);
  };

  const openCommandPalette = () => {
    setIsCommandMenuOpen(true);
    setIsNotificationsOpen(false);
    setIsQuickActionsOpen(false);
    setIsHelpOpen(false);
    setIsProfileMenuOpen(false);
  };

  const toggleQuickActions = () => {
    setIsQuickActionsOpen((current) => !current);
    setIsNotificationsOpen(false);
    setIsHelpOpen(false);
    setIsProfileMenuOpen(false);
    setIsCommandMenuOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((current) => !current);
    setIsQuickActionsOpen(false);
    setIsHelpOpen(false);
    setIsProfileMenuOpen(false);
    setIsCommandMenuOpen(false);
  };

  const toggleHelpMenu = () => {
    setIsHelpOpen((current) => !current);
    setIsNotificationsOpen(false);
    setIsQuickActionsOpen(false);
    setIsProfileMenuOpen(false);
    setIsCommandMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((current) => !current);
    setIsNotificationsOpen(false);
    setIsQuickActionsOpen(false);
    setIsHelpOpen(false);
    setIsCommandMenuOpen(false);
  };

  const navigateTo = (path: string) => {
    closeAllMenus();
    router.push(path);
  };

  const handleCommandSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (filteredCommands.length === 0) {
      return;
    }

    const selectedCommand = filteredCommands[activeCommandIndex] ?? filteredCommands[0];
    navigateTo(selectedCommand.path);
  };

  const handleCommandKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!isCommandMenuOpen || filteredCommands.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveCommandIndex((current) => (current + 1) % filteredCommands.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveCommandIndex((current) =>
        current === 0 ? filteredCommands.length - 1 : current - 1
      );
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({ ...notification, unread: false }))
    );
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/homepage');
    router.refresh();
  };

  const headerDescription = description || 'Manage your links, analytics, and workspace actions.';

  return (
    <header className="fixed inset-x-0 top-0 z-[120] border-b border-border/80 bg-[#252830]/94 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] lg:px-0">
        <div className="flex h-[72px] items-center">
          <div className="hidden h-full w-[240px] items-center border-r border-border/80 px-6 lg:flex">
            <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Icon name="BoltIcon" size={18} variant="solid" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">LinkLab</p>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    Live
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{headerDescription}</p>
              </div>
            </Link>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Link href="/dashboard" className="flex min-w-0 items-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Icon name="BoltIcon" size={18} variant="solid" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{title}</p>
                <p className="truncate text-xs text-muted-foreground">LinkLab Workspace</p>
              </div>
            </Link>

            <div className="hidden min-w-0 items-center gap-4 lg:flex lg:flex-1">
              <div ref={commandMenuRef} className="relative w-full max-w-[440px] xl:max-w-[520px]">
                <form onSubmit={handleCommandSubmit}>
                  <label className="flex h-10 items-center gap-3 rounded-xl border border-border/70 bg-white/[0.04] px-4 text-sm text-muted-foreground transition-all focus-within:border-primary/50 focus-within:bg-white/[0.06]">
                    <Icon
                      name="MagnifyingGlassIcon"
                      size={17}
                      variant="outline"
                      className="text-muted-foreground"
                    />
                    <input
                      ref={desktopCommandInputRef}
                      value={commandQuery}
                      onFocus={openCommandPalette}
                      onKeyDown={handleCommandKeyDown}
                      onChange={(event) => {
                        setCommandQuery(event.target.value);
                        openCommandPalette();
                      }}
                      placeholder="Search links, pages, and actions"
                      className="h-full flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />
                    <span className="rounded-lg border border-border/70 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      ⌘K
                    </span>
                  </label>
                </form>

                {isCommandMenuOpen && (
                  <div
                    className={`absolute left-0 right-0 top-[calc(100%+12px)] p-3 ${overlayPanelClass}`}
                  >
                    <div className="mb-2 flex items-center justify-between px-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Quick navigation
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {filteredCommands.length} results
                      </p>
                    </div>
                    <div className="space-y-1">
                      {filteredCommands.length > 0 ? (
                        filteredCommands.map((command, index) => (
                          <button
                            type="button"
                            key={command.path}
                            onClick={() => navigateTo(command.path)}
                            className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all duration-250 hover:bg-white/[0.05] ${
                              activeCommandIndex === index ? 'bg-white/[0.06]' : ''
                            }`}
                          >
                            <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-primary">
                              <Icon name={command.icon} size={18} variant="outline" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center justify-between gap-3">
                                <span className="block truncate text-sm font-semibold text-foreground">
                                  {command.label}
                                </span>
                                {command.contextLabel ? (
                                  <span className="rounded-full border border-border/70 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                    {command.contextLabel}
                                  </span>
                                ) : null}
                              </span>
                              <span className="block text-xs text-muted-foreground">
                                {command.description}
                              </span>
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="rounded-xl border border-border/60 bg-white/[0.03] px-4 py-5 text-sm text-muted-foreground">
                          No matching results. Try “analytics”, “create”, or “settings”.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden min-w-0 xl:block">
                <p className="truncate text-sm font-semibold text-foreground">{title}</p>
                <p className="max-w-[280px] truncate text-xs text-muted-foreground">
                  {headerDescription}
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  if (isCommandMenuOpen) {
                    closeAllMenus();
                    return;
                  }

                  openCommandPalette();
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-white/[0.04] text-foreground transition-all hover:bg-white/[0.08] lg:hidden"
                aria-label="Open workspace search"
              >
                <Icon name="MagnifyingGlassIcon" size={18} variant="outline" />
              </button>

              <div ref={quickActionsRef} className="relative">
                <button
                  type="button"
                  onClick={toggleQuickActions}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:shadow-md"
                >
                  <Icon name="PlusIcon" size={16} variant="outline" />
                  <span className="hidden sm:inline">Quick Actions</span>
                </button>

                {isQuickActionsOpen && (
                  <div
                    className={`absolute right-0 top-[calc(100%+12px)] w-[320px] p-3 ${overlayPanelClass}`}
                  >
                    <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Create and manage
                    </p>
                    <div className="space-y-1">
                      {quickActionItems.map((item) => (
                        <button
                          type="button"
                          key={item.path}
                          onClick={() => navigateTo(item.path)}
                          className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all duration-250 hover:bg-white/[0.05]"
                        >
                          <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                            <Icon name={item.icon} size={18} variant="outline" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-foreground">
                              {item.label}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div ref={notificationsRef} className="relative">
                <button
                  type="button"
                  onClick={toggleNotifications}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-white/[0.04] text-foreground transition-all hover:bg-white/[0.08]"
                  aria-label="Notifications"
                >
                  <Icon name="BellIcon" size={18} variant="outline" />
                  {unreadNotifications > 0 && (
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary" />
                  )}
                </button>

                {isNotificationsOpen && (
                  <div
                    className={`absolute right-0 top-[calc(100%+12px)] w-[360px] p-3 ${overlayPanelClass}`}
                  >
                    <div className="mb-2 flex items-center justify-between px-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Signals inspired by modern SaaS dashboards.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-xs font-medium text-primary"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="rounded-xl border border-border/60 bg-white/[0.03] px-3 py-3"
                        >
                          <div className="mb-2 flex items-start justify-between gap-3">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${toneClasses[notification.tone]}`}
                            >
                              {notification.tone}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {notification.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div ref={helpRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={toggleHelpMenu}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-white/[0.04] text-foreground transition-all hover:bg-white/[0.08]"
                  aria-label="Help and resources"
                >
                  <Icon name="QuestionMarkCircleIcon" size={18} variant="outline" />
                </button>

                {isHelpOpen && (
                  <div
                    className={`absolute right-0 top-[calc(100%+12px)] w-[320px] p-3 ${overlayPanelClass}`}
                  >
                    <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Help center
                    </p>
                    {helpItems.map((item) => (
                      <button
                        type="button"
                        key={item.path}
                        onClick={() => navigateTo(item.path)}
                        className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all duration-250 hover:bg-white/[0.05]"
                      >
                        <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-foreground">
                          <Icon name={item.icon} size={18} variant="outline" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-foreground">
                            {item.label}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-3 rounded-full border border-border/70 bg-white/[0.04] py-1.5 pl-1.5 pr-3 text-foreground transition-all hover:bg-white/[0.08]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-semibold text-white">
                    {userInitial}
                  </span>
                  <span className="hidden max-w-[170px] truncate text-sm font-medium text-foreground lg:block">
                    {user?.email ?? 'Workspace account'}
                  </span>
                  <Icon
                    name={isProfileMenuOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                    size={16}
                    variant="outline"
                    className="hidden text-muted-foreground lg:block"
                  />
                </button>

                {isProfileMenuOpen && (
                  <div
                    className={`absolute right-0 top-[calc(100%+12px)] w-[320px] p-3 ${overlayPanelClass}`}
                  >
                    <div className="rounded-2xl border border-border/60 bg-white/[0.03] px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
                        Signed in as
                      </p>
                      <p className="mt-2 break-all text-sm font-medium text-foreground">
                        {user?.email}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Manage account access, notifications, and workspace settings.
                      </p>
                    </div>
                    <div className="mt-3 space-y-1">
                      <button
                        type="button"
                        onClick={() => navigateTo('/settings')}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-250 hover:bg-white/[0.05]"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-foreground">
                          <Icon name="Cog6ToothIcon" size={18} variant="outline" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-foreground">
                            Workspace settings
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            Profile, notifications, and defaults
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateTo('/dashboard')}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-250 hover:bg-white/[0.05]"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-foreground">
                          <Icon name="Squares2X2Icon" size={18} variant="outline" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-foreground">
                            Back to overview
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            Review workspace KPIs and recent links
                          </span>
                        </span>
                      </button>
                    </div>
                    <div className="my-3 h-px bg-border/60" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-all duration-250 hover:bg-red-500/[0.08]"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/[0.08] text-red-300">
                          <Icon name="ArrowRightOnRectangleIcon" size={18} variant="outline" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-foreground">
                            Logout
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            End this session securely
                          </span>
                        </span>
                      </span>
                      <Icon
                        name="ChevronRightIcon"
                        size={16}
                        variant="outline"
                        className="text-muted-foreground"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isCommandMenuOpen && (
          <div className="border-t border-border/80 px-4 py-3 sm:px-6 lg:hidden">
            <div ref={mobileCommandMenuRef} className="space-y-3">
              <form onSubmit={handleCommandSubmit}>
                <label className="flex h-10 items-center gap-3 rounded-xl border border-border/70 bg-white/[0.04] px-4 text-sm text-muted-foreground transition-all focus-within:border-primary/50 focus-within:bg-white/[0.06]">
                  <Icon
                    name="MagnifyingGlassIcon"
                    size={17}
                    variant="outline"
                    className="text-muted-foreground"
                  />
                  <input
                    ref={mobileCommandInputRef}
                    value={commandQuery}
                    onKeyDown={handleCommandKeyDown}
                    onChange={(event) => setCommandQuery(event.target.value)}
                    autoFocus
                    placeholder="Search links, pages, and actions"
                    className="h-full flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </label>
              </form>

              <div className={`p-3 ${overlayPanelClass}`}>
                <div className="mb-2 flex items-center justify-between px-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Quick navigation
                  </p>
                  <p className="text-xs text-muted-foreground">{filteredCommands.length} results</p>
                </div>
                <div className="space-y-1">
                  {filteredCommands.length > 0 ? (
                    filteredCommands.map((command, index) => (
                      <button
                        type="button"
                        key={command.path}
                        onClick={() => navigateTo(command.path)}
                        className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all duration-250 hover:bg-white/[0.05] ${
                          activeCommandIndex === index ? 'bg-white/[0.06]' : ''
                        }`}
                      >
                        <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-primary">
                          <Icon name={command.icon} size={18} variant="outline" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-3">
                            <span className="block truncate text-sm font-semibold text-foreground">
                              {command.label}
                            </span>
                            {command.contextLabel ? (
                              <span className="rounded-full border border-border/70 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                {command.contextLabel}
                              </span>
                            ) : null}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {command.description}
                          </span>
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-xl border border-border/60 bg-white/[0.03] px-4 py-5 text-sm text-muted-foreground">
                      No matching results. Try “analytics”, “create”, or “settings”.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
