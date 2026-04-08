'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAdmin, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/login');
    }
  }, [isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/admin/dashboard" className="text-3xl font-bold text-indigo-600">
            QR Admin
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/admin/dashboard" className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded font-semibold">
              Dashboard
            </Link>
            <Link href="/admin/generator" className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded">
              Create Card
            </Link>
            <Link href="/admin/history" className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded">
              History
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
