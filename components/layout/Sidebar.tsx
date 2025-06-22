import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useClerk } from '@clerk/nextjs';
import {
  HomeIcon,
  PersonIcon,
  GearIcon,
  ExitIcon,
} from '@radix-ui/react-icons';
import { SiStripe } from 'react-icons/si';

const mainNavLinks = [
  { icon: HomeIcon, label: 'Dashboard', href: '/dashboard' },
  { icon: PersonIcon, label: 'Agents', href: '/agents' },
];

const footerLinks = [
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
      <item.icon className="h-5 w-5 text-slate-500" />
      <span>{item.label}</span>
    </Link>
  </li>
);

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut(() => router.push('/login'));
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-lg font-semibold text-white">
            S
          </div>
          <span className="text-lg font-semibold text-slate-800">Stripe</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {mainNavLinks.map((item) => (
            <NavItem key={item.label} item={item} isActive={router.pathname.startsWith(item.href)} />
          ))}
        </ul>
      </nav>
      
      {/* Footer Nav */}
      <div className="mt-auto space-y-1 px-4 py-4 border-t border-slate-200">
        <ul className="space-y-1">
          {footerLinks.map((item) => (
            <NavItem key={item.label} item={item} isActive={router.pathname.startsWith(item.href)} />
          ))}
        </ul>
      </div>

      {/* User Profile */}
      <div className="border-t border-slate-200 p-4">
        <div className="group flex cursor-pointer items-center gap-3" onClick={handleSignOut}>
          <img
            className="h-9 w-9 rounded-full object-cover"
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="User avatar"
          />
          <div className="flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">Nicolas Baranowski</p>
            <p className="truncate text-xs text-slate-500">nicolas@company.com</p>
          </div>
          <ExitIcon className="h-5 w-5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 