"use client";

import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center space-x-2 font-bold text-xl text-blue-600 dark:text-blue-400">
          <Activity />
          <span>Renpin</span>
        </Link>
      </nav>
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
