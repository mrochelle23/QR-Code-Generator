'use client';

import QRCodeDisplay from './QRCodeDisplay';

interface BusinessCardPreviewProps {
  personName: string;
  personTitle: string;
  company: string;
  personPhoto: string | null;
  companyLogo: string | null;
  qrSize: number;
}

export default function BusinessCardPreview({
  personName,
  personTitle,
  company,
  personPhoto,
  companyLogo,
  qrSize,
}: BusinessCardPreviewProps) {
  // Static placeholder QR - actual will be generated after save
  const placeholderQR = 'https://example.com/card';

  const getInitials = (name: string | undefined) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div
      className="rounded-lg p-6 border-2 border-gray-200"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Personal Photo - Circular Profile */}
      {personPhoto ? (
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 bg-gray-50 flex items-center justify-center shadow overflow-hidden mx-auto mb-4">
          <img
            src={personPhoto}
            alt={personName}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 bg-gray-50 flex items-center justify-center shadow mx-auto mb-4 text-xl text-gray-400">
          {getInitials(personName)}
        </div>
      )}

      {/* Company Logo */}
      {companyLogo && (
        <div className="mb-2 flex justify-center">
          <img
            src={companyLogo}
            alt={company}
            className="h-10 object-contain"
          />
        </div>
      )}

      {/* Name */}
      {personName && (
        <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
          {personName}
        </h2>
      )}

      {/* Title */}
      {personTitle && (
        <p className="text-sm text-gray-600 text-center mb-3">
          {personTitle}
        </p>
      )}

      {/* Company */}
      {company && (
        <p className="text-sm font-semibold text-gray-700 text-center mb-4">
          {company}
        </p>
      )}

      {/* QR Code */}
      <div className="flex justify-center mb-4">
        <QRCodeDisplay
          text={placeholderQR}
          size={qrSize}
          logoImage={companyLogo}
        />
      </div>

      <div className="text-xs text-gray-500 text-center">
        Scan to view card
      </div>
    </div>
  );
}
