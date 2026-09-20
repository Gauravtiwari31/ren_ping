"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Activity } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center space-x-2 font-bold text-xl text-blue-600 dark:text-blue-400">
          <Activity />
          <span>KeepAlive</span>
        </Link>
        <button onClick={handleLogout} className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-500">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
