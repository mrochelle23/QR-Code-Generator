'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IQRCode } from '@/models/BusinessCard';

export default function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  const [card, setCard] = useState<IQRCode | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [error, setError] = useState('');
  const [slug, setSlug] = useState('');
  const [expandedSections, setExpandedSections] = useState<{
    contact: boolean;
    company: boolean;
    summary: boolean;
    socialMedia: boolean;
  }>({
    contact: false,
    company: false,
    summary: false,
    socialMedia: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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
      const startTime = Date.now();
      
      try {
        const response = await fetch(`/api/qrcodes/slug/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setCard(data);
          
          // Ensure loading screen shows for at least 800ms before transitioning
          const elapsedTime = Date.now() - startTime;
          const minLoadTime = 800;
          const delay = Math.max(0, minLoadTime - elapsedTime);
          
          setTimeout(() => {
            setDataLoaded(true);
            // Trigger fade-in after data is "loaded"
            setTimeout(() => setShowContent(true), 50);
          }, delay);
        } else {
          setError('Card not found');
          setDataLoaded(true);
        }
      } catch (err) {
        console.error('Error fetching card:', err);
        setError('Error loading card');
        setDataLoaded(true);
      }
    };

    fetchCard();
  }, [slug]);

  const generateVCard = () => {
    if (!card) return '';

    const vCardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.personName}`,
      `N:${card.personName.split(' ').reverse().join(';')}`,
    ];

    if (card.personTitle) vCardLines.push(`TITLE:${card.personTitle}`);
    if (card.company) vCardLines.push(`ORG:${card.company}`);
    if (card.companyAddress) vCardLines.push(`ADR:;;${card.companyAddress}`);
    if (card.phone) vCardLines.push(`TEL:${card.phone}`);
    if (card.email) vCardLines.push(`EMAIL:${card.email}`);

    card.socialMedia?.forEach((sm) => {
      if (sm.platform.toLowerCase() === 'email' && !card.email) {
        vCardLines.push(`EMAIL:${sm.url}`);
      } else if (sm.platform.toLowerCase() === 'phone' && !card.phone) {
        vCardLines.push(`TEL:${sm.url}`);
      } else if (sm.platform.toLowerCase() === 'website') {
        vCardLines.push(`URL:${sm.url}`);
      }
    });


    vCardLines.push('END:VCARD');
    return vCardLines.join('\r\n');
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If it's 10 digits (US format), format as (123) 456-7890
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    
    // If it starts with +1 or 1, try to extract 10 digits
    if (digits.length === 11 && digits.startsWith('1')) {
      return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    
    // Otherwise return as-is
    return phone;
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleAddToContacts = () => {
    const vCard = generateVCard();
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card?.personName || 'contact'}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 transition-opacity duration-700"
        style={{ backgroundColor: '#E9D5FF', opacity: showContent ? 1 : 0 }}
      >
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-sm w-full">
          <p className="text-gray-600 text-lg mb-4">{error}</p>
          <Link href="/" className="text-indigo-600 hover:underline font-semibold">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 transition-opacity duration-700"
        style={{ backgroundColor: '#E9D5FF' }}
      >
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-sm w-full">
          <p className="text-gray-600 text-lg mb-4">Card not found</p>
          <Link href="/" className="text-indigo-600 hover:underline font-semibold">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  // Get contact info from social media and dedicated fields
  const phoneContact = card?.phone || card?.socialMedia?.find(
    (sm) => sm.platform.toLowerCase() === 'phone'
  )?.url;
  const emailContact = card?.email || card?.socialMedia?.find(
    (sm) => sm.platform.toLowerCase() === 'email'
  )?.url;
  const contentBgPattern = card?.contentBgPattern || 'none';
  const contentBgOpacity = card?.contentBgOpacity || 15;

  return (
    <>
      {/* Loading Screen Overlay */}
      <div
        className="fixed inset-0 flex items-center justify-center transition-opacity duration-700 pointer-events-none z-50 px-4"
        style={{
          backgroundColor: '#FFFFFF',
          opacity: dataLoaded ? 0 : 1,
        }}
      >
        <div className="text-center">
          {card?.companyLogo && (
            <div className="flex justify-center">
              <img
                src={card.companyLogo}
                alt={card.company}
                className="h-32 object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div
        className="min-h-screen flex flex-col transition-opacity duration-700"
        style={{
          opacity: showContent ? 1 : 0,
        }}
      >
        {/* Profile Section - Colored Background */}
        <div
          className="px-4 py-8 flex flex-col items-center"
          style={{
            backgroundColor: card?.cardBgColor || '#E9D5FF',
          }}
        >
          {/* Profile Container */}
          <div className="w-full max-w-sm">
            <div className="flex flex-col items-center mb-6">
              {/* Profile Image */}
              {card.personPhoto ? (
                <div className="w-24 h-24 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-lg overflow-hidden">
                  <img
                    src={card.personPhoto}
                    alt={card.personName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-lg text-4xl text-gray-300">
                  {getInitials(card.personName)}
                </div>
              )}

              {/* Name */}
              <h1 className="text-2xl font-bold text-white mt-4 text-center">
                {card.personName}
              </h1>

              {/* Add Contact Button */}
              <button
                onClick={handleAddToContacts}
                className="mt-4 flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add contact
              </button>
            </div>
          </div>
        </div>

        {/* Sections Container - White Background */}
        <div
          className="flex-1 w-full px-4 py-8 rounded-t-3xl relative"
          style={{
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Background Pattern Layer - Logo Repeat */}
          {contentBgPattern === 'logo-repeat' && card?.companyLogo && (
            <div
              className="absolute inset-0 rounded-t-3xl overflow-hidden"
              style={{
                backgroundImage: `url(${card.companyLogo})`,
                backgroundRepeat: 'repeat',
                backgroundSize: '150px 150px',
                backgroundPosition: '0 0',
                opacity: contentBgOpacity / 100,
                filter: 'grayscale(30%)',
                zIndex: 0,
              }}
            />
          )}

          {/* Background Pattern Layer - Banner */}
          {contentBgPattern === 'banner-repeat' && (
            <div
              className="absolute inset-0 rounded-t-3xl"
              style={{
                background: `repeating-linear-gradient(
                  45deg,
                  transparent 0px,
                  transparent 35px,
                  rgba(100, 100, 100, ${contentBgOpacity / 100}) 35px,
                  rgba(100, 100, 100, ${contentBgOpacity / 100}) 70px
                )`,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}
          <div className="w-full max-w-sm mx-auto relative z-10">
            {/* Expandable Sections - Each as separate card */}
            <div className="space-y-4 w-full">
              {/* Contact Section */}
              {(phoneContact || emailContact) && (
                <div className="bg-gray-50 rounded-2xl shadow-md overflow-hidden border border-gray-200">
              <button
                onClick={() => toggleSection('contact')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-semibold text-gray-800">Contact</span>
                </div>
                <span
                  className="text-gray-400 transition-transform duration-300"
                  style={{
                    transform: expandedSections.contact
                      ? 'rotate(90deg)'
                      : 'rotate(0deg)',
                  }}
                >
                  ›
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: expandedSections.contact ? '500px' : '0px',
                  opacity: expandedSections.contact ? 1 : 0,
                }}
              >
                <div className="px-6 py-4 bg-gray-50 space-y-3">
                  {phoneContact && (
                    <a
                      href={`tel:${phoneContact}`}
                      className="flex items-center gap-3 text-indigo-600 hover:text-indigo-700 text-sm"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{formatPhoneNumber(phoneContact)}</span>
                    </a>
                  )}
                  {emailContact && (
                    <a
                      href={`mailto:${emailContact}`}
                      className="flex items-center gap-3 text-indigo-600 hover:text-indigo-700 text-sm"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{emailContact}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

              {/* Company Section */}
              {(card.company || card.companyAddress || card.personTitle) && (
                <div className="bg-gray-50 rounded-2xl shadow-md overflow-hidden border border-gray-200">
              <button
                onClick={() => toggleSection('company')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-semibold text-gray-800">Company</span>
                </div>
                <span
                  className="text-gray-400 transition-transform duration-300"
                  style={{
                    transform: expandedSections.company
                      ? 'rotate(90deg)'
                      : 'rotate(0deg)',
                  }}
                >
                  ›
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: expandedSections.company ? '500px' : '0px',
                  opacity: expandedSections.company ? 1 : 0,
                }}
              >
                <div className="px-6 py-4 bg-gray-50 space-y-2">
                  {card.personTitle && (
                    <p className="text-gray-700 text-sm">
                      <span className="font-semibold">Title:</span> {card.personTitle}
                    </p>
                  )}
                  {card.company && (
                    <p className="text-gray-700 text-sm">
                      <span className="font-semibold">Name:</span> {card.company}
                    </p>
                  )}
                  {card.companyAddress && (
                    <p className="text-gray-700 text-sm">
                      <span className="font-semibold">Address:</span>{' '}
                      {card.companyAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

              {/* Summary Section */}
              {card.companySummary && (
                <div className="bg-gray-50 rounded-2xl shadow-md overflow-hidden border border-gray-200">
              <button
                onClick={() => toggleSection('summary')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-gray-800">Summary</span>
                </div>
                <span
                  className="text-gray-400 transition-transform duration-300"
                  style={{
                    transform: expandedSections.summary
                      ? 'rotate(90deg)'
                      : 'rotate(0deg)',
                  }}
                >
                  ›
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: expandedSections.summary ? '500px' : '0px',
                  opacity: expandedSections.summary ? 1 : 0,
                }}
              >
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {card.companySummary}
                  </p>
                </div>
              </div>
            </div>
          )}

              {/* Social Media Section */}
              {card.socialMedia && card.socialMedia.filter(sm => sm.platform.toLowerCase() !== 'phone' && sm.platform.toLowerCase() !== 'email').length > 0 && (
                <div className="bg-gray-50 rounded-2xl shadow-md overflow-hidden border border-gray-200">
              <button
                onClick={() => toggleSection('socialMedia')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="font-semibold text-gray-800">Social Media</span>
                </div>
                <span
                  className="text-gray-400 transition-transform duration-300"
                  style={{
                    transform: expandedSections.socialMedia
                      ? 'rotate(90deg)'
                      : 'rotate(0deg)',
                  }}
                >
                  ›
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: expandedSections.socialMedia ? '500px' : '0px',
                  opacity: expandedSections.socialMedia ? 1 : 0,
                }}
              >
                <div className="px-6 py-4 bg-gray-50 space-y-3">
                  {card.socialMedia.filter(sm => sm.platform.toLowerCase() !== 'phone' && sm.platform.toLowerCase() !== 'email').map((sm, index) => (
                    <a
                      key={index}
                      href={sm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-indigo-600 hover:text-indigo-700 text-sm"
                    >
                      {sm.icon && (
                        <div
                          className="w-4 h-4 flex-shrink-0"
                          dangerouslySetInnerHTML={{ __html: sm.icon }}
                        />
                      )}
                      <span>{sm.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }
