'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IQRCode } from '@/models/BusinessCard';

export default function History() {
  const [qrCodes, setQrCodes] = useState<IQRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      const response = await fetch('/api/qrcodes?userId=default-user');
      if (response.ok) {
        const data = await response.json();
        setQrCodes(data);
      } else {
        setError('Failed to load QR codes');
      }
    } catch (err) {
      console.error('Error fetching QR codes:', err);
      setError('Error loading QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this QR code?')) return;

    try {
      const response = await fetch(`/api/qrcodes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQrCodes(qrCodes.filter((qr) => String(qr._id) !== id));
        alert('QR code deleted successfully');
      } else {
        alert('Failed to delete QR code');
      }
    } catch (error) {
      console.error('Error deleting QR code:', error);
      alert('Error deleting QR code');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-indigo-600">
            QR Code Generator
          </Link>
          <div className="flex gap-4">
            <Link href="/generator" className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded">
              Generator
            </Link>
            <Link href="/history" className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded font-semibold">
              History
            </Link>
            <Link href="/settings" className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded">
              Settings
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Your QR Codes</h2>
          <p className="text-gray-600">View and manage all your saved QR codes</p>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && qrCodes.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No QR codes yet</p>
            <Link
              href="/generator"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Create Your First QR Code
            </Link>
          </div>
        )}

        {!loading && qrCodes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {qrCodes.map((qr) => (
              <div
                key={String(qr._id)}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {/* Card Background with Logo */}
                <div
                  className="h-32 flex items-center justify-center relative"
                  style={{ backgroundColor: qr.cardBgColor || '#FFFFFF' }}
                >
                  {qr.companyLogo ? (
                    <img
                      src={qr.companyLogo}
                      alt={qr.company}
                      className="h-20 object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-4xl">📇</div>
                  )}
                </div>

                <div className="p-6">
                  {qr.personName && (
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {qr.personName}
                    </h3>
                  )}

                  {qr.personTitle && (
                    <p className="text-sm text-gray-600 mb-2">
                      {qr.personTitle}
                    </p>
                  )}

                  {qr.company && (
                    <p className="text-sm font-semibold text-indigo-600 mb-3">
                      {qr.company}
                    </p>
                  )}

                  {qr.socialMedia && qr.socialMedia.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {qr.socialMedia.slice(0, 4).map((sm: any, idx: number) => (
                        <span key={idx} className="text-lg" title={sm.platform}>
                          {sm.icon}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mb-3">
                    <Link
                      href={`/cards/${qr.slug}`}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm text-center"
                    >
                      View
                    </Link>
                    <Link
                      href={`/cards/${qr.slug}/edit`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(String(qr._id))}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    {new Date(qr.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
