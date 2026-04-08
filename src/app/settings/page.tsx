'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Settings() {
  const [defaultErrorCorrection, setDefaultErrorCorrection] = useState('M');
  const [defaultSize, setDefaultSize] = useState(256);
  const [theme, setTheme] = useState('light');
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    // Save to localStorage for now
    localStorage.setItem('defaultErrorCorrection', defaultErrorCorrection);
    localStorage.setItem('defaultSize', String(defaultSize));
    localStorage.setItem('theme', theme);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-indigo-600">
            MyQRCode
          </Link>
          <div className="flex gap-4">
            <Link href="/generator" className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded">
              Generator
            </Link>
            <Link href="/history" className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded">
              History
            </Link>
            <Link href="/settings" className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded font-semibold">
              Settings
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Settings</h2>
          <p className="text-gray-600">Customize your preferences</p>
        </div>

        {saved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            ✓ Settings saved successfully
          </div>
        )}

        <div className="space-y-6">
          {/* Default QR Code Settings */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Default QR Code Settings</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Error Correction
                </label>
                <select
                  value={defaultErrorCorrection}
                  onChange={(e) => setDefaultErrorCorrection(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  Higher values allow for more damage before the QR code becomes unreadable
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Size: {defaultSize}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={defaultSize}
                  onChange={(e) => setDefaultSize(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Size of generated QR codes
                </p>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Appearance</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Account</h3>

            <div className="space-y-4">
              <div>
                <p className="text-gray-600 mb-4">
                  Currently logged in as: <span className="font-semibold">default-user</span>
                </p>
              </div>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
                Sign Out
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </main>
  );
}
