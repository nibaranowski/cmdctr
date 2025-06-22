import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  PieChartIcon,
  StarIcon,
  RowsIcon,
  Link2Icon,
  ClockIcon,
  BellIcon,
  PersonIcon,
  LockClosedIcon,
  CookieIcon,
  UploadIcon,
  DownloadIcon,
  GearIcon,
  FileTextIcon,
  ExternalLinkIcon,
  PlusIcon, // Placeholder for the 'Untitled UI' logo
} from '@radix-ui/react-icons';

const mainNavLinks = [
  { icon: PieChartIcon, label: 'Dashboard', href: '/dashboard' },
  { icon: StarIcon, label: 'Appearance', href: '/appearance' },
  { icon: RowsIcon, label: 'Database', href: '/database' },
  { icon: Link2Icon, label: 'Connections', href: '/connections' },
  { icon: ClockIcon, label: 'Timezones', href: '/timezones' },
  { icon: BellIcon, label: 'Notifications', href: '/notifications', badge: 4 },
];

const projectNavLinks = [
  { icon: PersonIcon, label: 'User management', href: '/users' },
  { icon: LockClosedIcon, label: 'Security & access', href: '/security' },
  { icon: CookieIcon, label: 'Payments', href: '/payments' },
  { icon: UploadIcon, label: 'Import data', href: '/import' },
  { icon: DownloadIcon, label: 'Export data', href: '/export' },
];

const footerNavLinks = [
  { icon: GearIcon, label: 'Settings', href: '/settings' },
  { icon: FileTextIcon, label: 'Documentation', href: '/docs' },
];

const NavItem = ({ item, isActive }: { item: { href: string; icon: React.ElementType; label: string; badge?: number }; isActive: boolean }) => (
  <li>
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
        isActive
          ? 'bg-slate-100 text-slate-900'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <item.icon className="h-5 w-5" />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
          {item.badge}
        </span>
      )}
    </Link>
  </li>
);

const Sidebar: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
          <PlusIcon className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-slate-800">Untitled UI</span>
        <span className="ml-auto rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
          v4.0
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 px-4 py-4">
        <div className="space-y-2">
          <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            General
          </h2>
          <ul className="space-y-1">
            {mainNavLinks.map((item) => (
              <NavItem key={item.label} item={item} isActive={router.pathname === item.href} />
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sisyphus Ventures
            </h2>
            {/* Kebab menu icon placeholder */}
            <button className="text-slate-400 hover:text-slate-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
            </button>
          </div>
          <ul className="space-y-1">
            {projectNavLinks.map((item) => (
              <NavItem key={item.label} item={item} isActive={router.pathname === item.href} />
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Footer Nav */}
      <div className="space-y-1 px-4 py-4">
        <ul className="space-y-1">
          {footerNavLinks.map((item) => (
            <NavItem key={item.label} item={item} isActive={router.pathname === item.href} />
          ))}
          <li>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <ExternalLinkIcon className="h-5 w-5" />
              <span>Open in browser</span>
              <span className="ml-auto text-slate-400">⌘O</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* User Profile */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-medium text-white">
            JD
          </div>
          <div className="flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">John Doe</p>
            <p className="truncate text-xs text-slate-500">john@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 