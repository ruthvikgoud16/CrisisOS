'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  AlertTriangle,
  Map,
  FileText,
  BarChart3,
  Shield,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { name: 'Map', href: '/map', icon: Map },
  { name: 'Report', href: '/report', icon: FileText },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-[#111827] border-r border-gray-800">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-800">
        <Shield className="h-8 w-8 text-blue-500" />
        <span className="text-xl font-bold text-white">CrisisOS</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white">OP</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Operations</p>
            <p className="text-xs text-gray-400">Emergency Response</p>
          </div>
        </div>
      </div>
    </div>
  );
}
