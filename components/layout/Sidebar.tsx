import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  HomeIcon,
  PersonIcon,
  GearIcon,
  MagnifyingGlassIcon,
  ExitIcon,
  PlusIcon, // Placeholder for 'Untitled UI' logo, will be replaced
} from '@radix-ui/react-icons';

const navLinks = [
  { icon: HomeIcon, label: 'Home', href: '/dashboard' },
  { icon: PersonIcon, label: 'Agents', href: '/agents' },
];

const settingsLink = { icon: GearIcon, label: 'Settings', href: '/settings' };

const NavItem = ({ item, isActive }: { item: { href: string; icon: React.ElementType; label: string; }; isActive: boolean }) => (
  <li>
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-all ${
        isActive
          ? 'bg-violet-50 text-violet-700'
          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <item.icon className={`h-5 w-5 ${isActive ? 'text-violet-700' : 'text-slate-500'}`} />
      <span>{item.label}</span>
    </Link>
  </li>
);

const Sidebar: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-purple-600">
          <PlusIcon className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-800">Untitled UI</span>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-4">
        <ul className="space-y-1">
          {navLinks.map((item) => (
            <NavItem key={item.label} item={item} isActive={router.pathname === item.href} />
          ))}
        </ul>
      </nav>
      
      {/* Footer Nav */}
      <div className="space-y-1 px-4 py-4 border-t border-slate-200">
        <ul className="space-y-1">
          <NavItem item={settingsLink} isActive={router.pathname === settingsLink.href} />
        </ul>
      </div>

      {/* User Profile */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-medium text-white">
            NB
          </div>
          <div className="flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">Nicolas Baranowski</p>
            <p className="truncate text-xs text-slate-500">nicolas@company.com</p>
          </div>
          <button className="text-slate-500 hover:text-slate-800">
            <ExitIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 