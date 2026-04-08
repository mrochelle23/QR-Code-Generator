'use client';

import QRCode from 'qrcode.react';
import { useRef } from 'react';

interface QRCodeDisplayProps {
  text: string;
  size?: number;
  logoImage?: string | null;
}

export default function QRCodeDisplay({
  text,
  size = 256,
  logoImage = null,
}: QRCodeDisplayProps) {
  const qrRef = useRef<any>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={qrRef}
        className="relative inline-block"
        style={{
          padding: '10px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
        }}
      >
        <div className="relative inline-block">
          <QRCode
            value={text}
            size={size}
            level="H"
            includeMargin={true}
            fgColor="#000000"
            bgColor="#FFFFFF"
          />
          {/* Logo overlay in center */}
          {logoImage && (
            <img
              src={logoImage}
              alt="Logo"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${size * 0.25}px`,
                height: `${size * 0.25}px`,
                backgroundColor: '#FFFFFF',
                padding: '4px',
                borderRadius: '4px',
                objectFit: 'contain',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
