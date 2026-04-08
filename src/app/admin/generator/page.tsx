'use client';

import { useState } from 'react';
import BusinessCardPreview from '@/components/BusinessCardPreview';

export default function AdminGenerator() {
  const [cardName, setCardName] = useState('My Business Card');
  const [personName, setPersonName] = useState('');
  const [personTitle, setPersonTitle] = useState('');
  const [company, setCompany] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companySummary, setCompanySummary] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [personPhoto, setPersonPhoto] = useState<string | null>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [socialMedia, setSocialMedia] = useState<{ platform: string; url: string; icon?: string }[]>([]);
  const [cardBgColor, setCardBgColor] = useState('#FFFFFF');
  const [contentBgPattern, setContentBgPattern] = useState('none');
  const [contentBgOpacity, setContentBgOpacity] = useState(15);
  const qrSize = 256;
  const errorCorrection = 'M';
  const [isSaving, setIsSaving] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-');
  };

  const slug = generateSlug(personName);
  const qrText = `${process.env.NEXT_PUBLIC_API_URL}/cards/${slug}`;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCompanyLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPersonPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCard = async () => {
    if (!personName.trim() || !company.trim()) {
      alert('Please fill in at least name and company');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/qrcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cardName,
          slug,
          text: qrText,
          personName,
          personTitle,
          company,
          companyAddress,
          companySummary,
          phone,
          email,
          personPhoto,
          companyLogo,
          socialMedia,
          cardBgColor,
          contentBgPattern,
          contentBgOpacity,
          qrSize,
          errorCorrection,
          userId: 'default-user',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Business card created! Share this link: ${process.env.NEXT_PUBLIC_API_URL}/cards/${data.slug}`);
        // Reset form
        setCardName('My Business Card');
        setPersonName('');
        setPersonTitle('');
        setCompany('');
        setCompanyAddress('');
        setCompanySummary('');
        setPhone('');
        setEmail('');
        setPersonPhoto(null);
        setCompanyLogo(null);
        setSocialMedia([]);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save card');
      }
    } catch (error) {
      console.error('Error saving card:', error);
      alert('Error saving card');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Create Business Card</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Preview</h3>
            <BusinessCardPreview
              personName={personName || 'Your Name'}
              personTitle={personTitle || 'Your Title'}
              company={company || 'Company Name'}
              personPhoto={personPhoto}
              companyLogo={companyLogo}
              qrSize={qrSize}
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-6">
            {/* Person Info */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800">Person Information</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="Your Name *"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={personTitle}
                  onChange={(e) => setPersonTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePersonPhotoUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Company Info */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800">Company Information</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company Name *"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <textarea
                  value={companySummary}
                  onChange={(e) => setCompanySummary(e.target.value)}
                  placeholder="Summary/Bio"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Customization */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800">Customization</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Background Color</label>
                  <input
                    type="color"
                    value={cardBgColor}
                    onChange={(e) => setCardBgColor(e.target.value)}
                    className="w-full h-10 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content Pattern</label>
                  <select
                    value={contentBgPattern}
                    onChange={(e) => setContentBgPattern(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="none">Plain</option>
                    <option value="logo-repeat">Company Logo Step & Repeat</option>
                    <option value="banner-repeat">Banner Pattern</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Pattern Opacity: {contentBgOpacity}%</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={contentBgOpacity}
                    onChange={(e) => setContentBgOpacity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveCard}
              disabled={isSaving}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Create Card'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
