'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Manage your QR code business cards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create New Card */}
        <Link href="/admin/generator" className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
          <div className="text-4xl mb-4">➕</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Create New Card</h3>
          <p className="text-gray-600">Generate a new business card QR code</p>
        </Link>

        {/* View History */}
        <Link href="/admin/history" className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">View History</h3>
          <p className="text-gray-600">Manage and edit your saved cards</p>
        </Link>

        {/* Home Page */}
        <Link href="/" className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Public Home</h3>
          <p className="text-gray-600">View the public landing page</p>
        </Link>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">How It Works</h3>
        <ul className="text-gray-700 space-y-2">
          <li>✓ Create a business card and generate a QR code</li>
          <li>✓ Each card gets a unique URL for scanning</li>
          <li>✓ Share the QR code with anyone to view your card</li>
          <li>✓ Edit or delete cards anytime from history</li>
          <li>✓ Customize colors, logos, and background patterns</li>
        </ul>
      </div>
    </div>
  );
}
