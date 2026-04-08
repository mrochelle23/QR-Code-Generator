import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">
            QR Code Generator
          </h1>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold">
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Create Custom QR Codes
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Fast, free, and  easy to use. Generate QR codes with custom colors, logos, and more.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Admin Access →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              Instant Generation
            </h3>
            <p className="text-gray-600">
              Create QR codes instantly. Admin-only access for security.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              Full Customization
            </h3>
            <p className="text-gray-600">
              Custom colors, add logos, adjust error correction, and more.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-5xl mb-4">💾</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              Save & Share
            </h3>
            <p className="text-gray-600">
              Save your QR codes, organize them, and download in multiple formats.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
