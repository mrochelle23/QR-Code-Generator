'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BusinessCardPreview from '@/components/BusinessCardPreview';
import { IQRCode } from '@/models/BusinessCard';

// Social media platforms with SVG logos
const SOCIAL_PLATFORMS = [
  { id: 'twitter', name: 'X (Twitter)', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.67-5.829 6.67H2.42l7.728-8.835L3.86 2.25h6.663l4.632 6.135L18.244 2.25zM17.15 19.75h1.832L6.283 4.126H4.281l12.869 15.624z"/></svg>' },
  { id: 'linkedin', name: 'LinkedIn', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.002 1.413-.103.25-.129.599-.129.949v5.443h-3.554s.047-8.832 0-9.749h3.554v1.381c.43-.664 1.199-1.608 2.920-1.608 2.134 0 3.734 1.394 3.734 4.389v5.587zM5.337 9.433c-1.144 0-1.915-.758-1.915-1.706 0-.955.771-1.71 1.97-1.71 1.197 0 1.911.759 1.935 1.71 0 .948-.738 1.706-1.99 1.706zm1.582 11.019H3.754V9.704h3.165v10.748zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>' },
  { id: 'github', name: 'GitHub', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>' },
  { id: 'instagram', name: 'Instagram', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.265-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg>' },
  { id: 'facebook', name: 'Facebook', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
  { id: 'youtube', name: 'YouTube', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' },
  { id: 'email', name: 'Email', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>' },
  { id: 'website', name: 'Website', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' },
  { id: 'phone', name: 'Phone', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>' },
];

export default function EditCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [cardData, setCardData] = useState<IQRCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [slug, setSlug] = useState('');

  // Form state
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
  const [socialMediaInput, setSocialMediaInput] = useState({ platform: '', url: '' });
  const [cardBgColor, setCardBgColor] = useState('#FFFFFF');
  const [contentBgPattern, setContentBgPattern] = useState('none');
  const [contentBgOpacity, setContentBgOpacity] = useState(15);
  const [qrSize, setQrSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [isSaving, setIsSaving] = useState(false);

  // Load card data on mount
  useEffect(() => {
    const loadParams = async () => {
      const { slug: paramSlug } = await params;
      setSlug(paramSlug);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchCard = async () => {
      try {
        const response = await fetch(`/api/qrcodes/slug/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setCardData(data);

          // Pre-fill form with card data
          setPersonName(data.personName || '');
          setPersonTitle(data.personTitle || '');
          setCompany(data.company || '');
          setCompanyAddress(data.companyAddress || '');
          setCompanySummary(data.companySummary || '');
          setPhone(data.phone || '');
          setEmail(data.email || '');
          setPersonPhoto(data.personPhoto || null);
          setCompanyLogo(data.companyLogo || null);
          setSocialMedia(data.socialMedia || []);
          setCardBgColor(data.cardBgColor || '#FFFFFF');
          setContentBgPattern(data.contentBgPattern || 'none');
          setContentBgOpacity(data.contentBgOpacity || 15);
          setQrSize(data.qrSize || 256);
          setErrorCorrection(data.errorCorrection || 'M');
        } else {
          setError('Card not found');
        }
      } catch (err) {
        console.error('Error fetching card:', err);
        setError('Error loading card');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [slug]);

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

  const handleAddSocialMedia = () => {
    if (socialMediaInput.platform && socialMediaInput.url) {
      let url = socialMediaInput.url.trim();
      const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.name === socialMediaInput.platform);
      const platformId = selectedPlatform?.id || socialMediaInput.platform.toLowerCase();

      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.match(/^[^@]+@[^@]+\.[^@]+$/)) {
        if (platformId === 'email') {
          url = 'mailto:' + url;
        } else {
          url = 'https://' + url;
        }
      }

      const newEntry = {
        platform: platformId,
        url,
        icon: selectedPlatform?.svg || '',
      };

      setSocialMedia([...socialMedia, newEntry]);
      setSocialMediaInput({ platform: '', url: '' });
    }
  };

  const handleRemoveSocialMedia = (index: number) => {
    setSocialMedia(socialMedia.filter((_, i) => i !== index));
  };

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!personName || !company) {
      alert('Please fill in name and company');
      return;
    }

    if (!cardData?._id) {
      alert('Card not found');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/qrcodes/${cardData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `${process.env.NEXT_PUBLIC_API_URL}/cards/${slug}`,
          name: cardData.name,
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
        }),
      });

      if (response.ok) {
        router.push(`/cards/${slug}`);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update card');
      }
    } catch (err) {
      console.error('Error updating card:', err);
      alert('Error updating card');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading card...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="text-indigo-600 hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Link href={`/cards/${slug}`} className="text-indigo-600 hover:underline font-semibold">
            ← Back to Card
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Edit Business Card</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleUpdateCard} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              {/* Person Information */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Person Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={personTitle}
                      onChange={(e) => setPersonTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePersonPhotoUpload}
                      className="w-full"
                    />
                    {personPhoto && (
                      <div className="mt-2">
                        <img src={personPhoto} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Summary/Bio</label>
                    <textarea
                      value={companySummary}
                      onChange={(e) => setCompanySummary(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full"
                    />
                    {companyLogo && (
                      <div className="mt-2">
                        <img src={companyLogo} alt="Logo Preview" className="h-12 object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customization */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Customization</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Background Color</label>
                    <input
                      type="color"
                      value={cardBgColor}
                      onChange={(e) => setCardBgColor(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Background Pattern</label>
                    <select
                      value={contentBgPattern}
                      onChange={(e) => setContentBgPattern(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="none">Plain</option>
                      <option value="logo-repeat">Company Logo Step & Repeat</option>
                      <option value="banner-repeat">Banner Pattern</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pattern Opacity: {contentBgOpacity}%
                    </label>
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

              {/* Social Media */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Social Media & Links</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <select
                      value={socialMediaInput.platform}
                      onChange={(e) => setSocialMediaInput({ ...socialMediaInput, platform: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select a platform...</option>
                      {SOCIAL_PLATFORMS.map((platform) => (
                        <option key={platform.id} value={platform.name}>
                          {platform.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="URL or handle"
                      value={socialMediaInput.url}
                      onChange={(e) => setSocialMediaInput({ ...socialMediaInput, url: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddSocialMedia}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                  {socialMedia.length > 0 && (
                    <div className="space-y-2">
                      {socialMedia.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm">{item.platform}: {item.url}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSocialMedia(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <Link
                  href={`/cards/${slug}`}
                  className="flex-1 border border-gray-300 px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
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
        </div>
      </div>
    </div>
  );
}
