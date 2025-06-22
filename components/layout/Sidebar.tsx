import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  HomeIcon,
  PersonIcon,
  GearIcon,
  PlusIcon,
} from '@radix-ui/react-icons';

const mainNavLinks = [
  { icon: HomeIcon, label: 'Home', href: '/dashboard' },
  { icon: PersonIcon, label: 'Agents', href: '/agents' },
];

const footerNavLinks = [
  { icon: GearIcon, label: 'Settings', href: '/settings' },
];

const NavItem = ({ item, isActive }: { item: { href: string; icon: React.ElementType; label: string; }; isActive: boolean }) => (
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
      <span>{item.label}</span>
    </Link>
  </li>
);

const Sidebar: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
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
      </nav>
      
      {/* Footer Nav */}
      <div className="space-y-1 px-4 py-4 mt-auto border-t border-slate-200">
        <ul className="space-y-1">
          {footerNavLinks.map((item) => (
            <NavItem key={item.label} item={item} isActive={router.pathname === item.href} />
          ))}
        </ul>
      </div>

      {/* User Profile */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-medium text-white">
            NB
          </div>
          <div className="flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">Nicolas Baranowski</p>
            <p className="truncate text-xs text-slate-500">nicolas@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 