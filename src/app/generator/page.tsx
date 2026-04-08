'use client';

import { useState } from 'react';
import Link from 'next/link';
import BusinessCardPreview from '@/components/BusinessCardPreview';

// Social media platforms with SVG logos
const SOCIAL_PLATFORMS = [
  { id: 'twitter', name: 'X (Twitter)', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.67-5.829 6.67H2.42l7.728-8.835L3.86 2.25h6.663l4.632 6.135L18.244 2.25zM17.15 19.75h1.832L6.283 4.126H4.281l12.869 15.624z"/></svg>' },
  { id: 'linkedin', name: 'LinkedIn', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.002 1.413-.103.25-.129.599-.129.949v5.443h-3.554s.047-8.832 0-9.749h3.554v1.381c.43-.664 1.199-1.608 2.920-1.608 2.134 0 3.734 1.394 3.734 4.389v5.587zM5.337 9.433c-1.144 0-1.915-.758-1.915-1.706 0-.955.771-1.71 1.97-1.71 1.197 0 1.911.759 1.935 1.71 0 .948-.738 1.706-1.99 1.706zm1.582 11.019H3.754V9.704h3.165v10.748zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>' },
  { id: 'github', name: 'GitHub', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>' },
  { id: 'instagram', name: 'Instagram', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.265-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg>' },
  { id: 'facebook', name: 'Facebook', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
  { id: 'youtube', name: 'YouTube', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' },
  { id: 'tiktok', name: 'TikTok', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.498 3.07c-.252-.451-.706-.751-1.245-.821C17.45 2.3 10.5 2.3 10.5 2.3s-6.95 0-7.523.049c-.539.07-.993.37-1.245.821C1.4 3.75 1.4 5.016 1.4 5.016v13.968c0 0 0 1.266.232 1.946.252.451.706.751 1.245.821C3.55 21.7 10.5 21.7 10.5 21.7s6.95 0 7.523-.049c.539-.07.993-.37 1.245-.821C22.6 20.25 22.6 18.984 22.6 18.984V5.016s0-1.266-.232-1.946h-.87zM9.075 16.738v-9.477L14.812 12l-5.737 4.738z"/></svg>' },
  { id: 'whatsapp', name: 'WhatsApp', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.783 1.14L.855 2.677 3.21 9.713a9.847 9.847 0 001.452 4.169 9.9 9.9 0 008.514 4.31h.004c5.46 0 9.9-4.44 9.9-9.9 0-2.634-.997-5.116-2.81-6.99A9.873 9.873 0 0012.051 6.979z"/></svg>' },
  { id: 'email', name: 'Email', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>' },
  { id: 'website', name: 'Website', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' },
  { id: 'pinterest', name: 'Pinterest', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 .378 8.934h5.125v4.655H2.881v4.652h2.622v7.192h5.125V18.24h3.406l.626-4.652h-4.032V10.3c0-.817.533-1.597 1.661-1.597h2.371V2.644C17.15 2.39 15.386 0 12 0z"/></svg>' },
  { id: 'discord', name: 'Discord', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.036c-.21.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.027c.462-.63.873-1.295 1.226-1.994.021-.04.001-.088-.041-.104a13.107 13.107 0 0 1-1.872-.892.083.083 0 0 1-.008-.138c.125-.093.25-.19.371-.287a.077.077 0 0 1 .079-.01c3.928 1.793 8.18 1.793 12.062 0a.077.077 0 0 1 .08.01c.12.098.246.195.371.288a.083.083 0 0 1-.006.137 12.053 12.053 0 0 1-1.873.892.083.083 0 0 0-.041.105c.352.699.764 1.365 1.225 1.994a.078.078 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-3.03.077.077 0 0 0 .032-.056c.5-4.506-.838-8.417-3.549-11.587a.06.06 0 0 0-.031-.028zM8.02 15.33c-.999 0-1.822-.915-1.822-2.034 0-1.12.809-2.034 1.822-2.034 1.022 0 1.848.922 1.822 2.034 0 1.12-.809 2.034-1.822 2.034zm7.975 0c-.999 0-1.822-.915-1.822-2.034 0-1.12.809-2.034 1.822-2.034 1.022 0 1.848.922 1.822 2.034 0 1.12-.8 2.034-1.822 2.034z"/></svg>' },
  { id: 'snapchat', name: 'Snapchat', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.383 0 0 5.09 0 12c0 2.36.876 4.635 2.468 6.44-.172 1.265-.59 4.032-2.368 4.952.36.49.934.783 1.63.783.438 0 .904-.08 1.398-.24 2.215-.756 4.283-2.404 5.872-4.45v.005c.5.05 1.006.075 1.517.075 5.338 0 10-4.226 10-9.565C24 5.082 19.338 0 12 0zm0 4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-5 2c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm10 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/></svg>' },
  { id: 'reddit', name: 'Reddit', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.682.305 2.25 1.093 2.977 2.59.603 1.22.523 2.78.523 2.78 0 2.202-1.962 3.995-4.383 3.995-2.461 0-4.313-1.781-4.313-3.971 0-1.993 1.066-3.556 2.937-4.074l.586-2.206-2.567.567c-.522-1.462-2.335-2.808-4.101-2.808-2.227 0-4.02 1.696-4.02 3.92 0 2.223 1.784 4.020 4.02 4.020.945 0 1.817-.305 2.529-.853l.508 1.635C5.231 20.445 3.806 21 2.5 21c-3.798 0-6.885-3.049-6.885-6.809 0-3.719 3.047-6.76 6.885-6.76 2.36 0 4.533 1.288 5.768 3.07l2.946-1.346c-.499-1.271-1.711-2.133-3.156-2.133-1.52 0-2.8.923-2.8 2.082 0 .926.666 1.703 1.652 1.703.96 0 1.88-.75 1.88-1.8 0-1.416-1.151-2.577-2.57-2.577-1.562 0-2.868 1.159-2.868 2.577 0 .944.764 1.76 1.76 1.76.973 0 1.847-.584 1.847-1.602 0-1.052-.906-1.9-2.029-1.9-1.225 0-2.273.868-2.273 1.9 0 1.032.987 1.875 2.21 1.875 1.246 0 2.304-.893 2.304-2.01 0-.998-.839-1.805-1.888-1.805-.788 0-1.469.461-1.469 1.25 0 .748.621 1.362 1.369 1.362.86 0 1.56-.682 1.56-1.542 0-.86-.7-1.56-1.56-1.56z"/></svg>' },
  { id: 'twitch', name: 'Twitch', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.429v4.286h-1.429V4.714zM17.143 4.714h1.429v4.286h-1.429V4.714zM6.857 7.429c-1.524 0-2.857 1.406-2.857 3.143v9.714h3.429v1.929l1.907-1.929h2.571c1.524 0 2.857-1.406 2.857-3.143V10.572c0-1.737-1.333-3.143-2.857-3.143H6.857z"/></svg>' },
  { id: 'telegram', name: 'Telegram', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a11.955 11.955 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a1.275 1.275 0 0 1 .433.364l.022.031c.481.7.848 1.666 1.221 2.582l.06.148c.537 1.301.537 2.902-.152 4.045-.568 1.066-1.522 1.591-2.651 1.591-.629 0-1.469-.356-2.559-.941-.381-.197-.757-.399-1.092-.567-.043-.02-.085-.041-.128-.06-1.537-.766-2.693-1.346-2.693-2.795 0-1.141.644-2.067 1.748-2.588.055-.028.112-.056.17-.084 1.012-.502 1.846-.505 2.324-.508.468-.003.822.212 1.028.627.147.28.161.524.157.756-.004.251-.011.455-.037.744-.058.921-.122 1.951-.652 2.574-.449.51-1.315.887-2.159.887-.979 0-1.846-.381-2.345-.956a4.926 4.926 0 0 1-.8-1.358l-.066-.132c-.196-.399-.403-.813-.673-1.217-.27-.404-.573-.788-.95-1.119-.377-.331-.834-.55-1.365-.55-.531 0-.988.219-1.365.55-.377.331-.68.715-.95 1.119-.27.404-.477.818-.673 1.217l-.066.132a4.883 4.883 0 0 1-.8 1.358c-.499.575-1.366.956-2.345.956-.844 0-1.71-.377-2.159-.887-.53-.623-.594-1.653-.652-2.574-.026-.289-.033-.493-.037-.744-.004-.232.01-.476.157-.756.206-.415.56-.63 1.028-.627.478.003 1.312 0 2.324.508.058.028.115.056.17.084 1.104.521 1.748 1.447 1.748 2.588 0 1.449-1.156 2.029-2.693 2.795-.043.019-.085.04-.128.06-.335.168-.711.37-1.092.567-1.09.585-1.93.941-2.559.941-1.129 0-2.083-.525-2.651-1.591-.689-1.143-.689-2.744-.152-4.045l.06-.148c.373-.916.74-1.882 1.221-2.582l.022-.031a1.275 1.275 0 0 1 .433-.364c.144-.117.365-.142.465-.14z"/></svg>' },
  { id: 'phone', name: 'Phone', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>' },
];

export default function Generator() {
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
  const [socialMediaInput, setSocialMediaInput] = useState({ platform: '', url: '' });

  const [cardBgColor, setCardBgColor] = useState('#FFFFFF');
  const [contentBgPattern, setContentBgPattern] = useState('none');
  const [contentBgOpacity, setContentBgOpacity] = useState(15);
  const [qrSize, setQrSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [isSaving, setIsSaving] = useState(false);

  // Generate slug from person name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-');
  };

  const slug = generateSlug(personName);

  // Generate QR code text - points to the card page
  const generateQrText = () => {
    const cardUrl = `${process.env.NEXT_PUBLIC_API_URL}/cards/${slug}`;
    return cardUrl;
  };

  const qrText = generateQrText();

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
      
      setSocialMedia([
        ...socialMedia,
        {
          platform: socialMediaInput.platform.trim(),
          url,
          icon: selectedPlatform?.svg || '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>',
        },
      ]);
      setSocialMediaInput({ platform: '', url: '' });
    } else {
      alert('Please select a platform and enter a URL');
    }
  };

  const handleRemoveSocialMedia = (index: number) => {
    setSocialMedia(socialMedia.filter((_, i) => i !== index));
  };

  const handleSaveCard = async () => {
    if (!personName.trim() || !company.trim()) {
      alert('Please fill in at least name and company');
      return;
    }

    if (!slug) {
      alert('Please enter a valid name to create a slug');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/qrcodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        setCardBgColor('#FFFFFF');
        setContentBgPattern('none');
        setContentBgOpacity(15);
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-indigo-600">
            QR Code Generator
          </Link>
          <div className="flex gap-4">
            <Link href="/generator" className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded font-semibold">
              Generator
            </Link>
            <Link href="/history" className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded">
              History
            </Link>
            <Link href="/settings" className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded">
              Settings
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Create Business Card QR Code</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Card Preview</h3>
              <BusinessCardPreview
                personName={personName}
                personTitle={personTitle}
                company={company}
                personPhoto={personPhoto}
                companyLogo={companyLogo}
                qrSize={qrSize}
              />
              <p className="text-xs text-gray-500 mt-4 text-center">
                Background color will be applied to the public card page
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Name */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Card Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Alex - Tech Corp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Alex Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={personTitle}
                    onChange={(e) => setPersonTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., CEO, Developer, Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Tech Corp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Address
                  </label>
                  <input
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 123 Main Street, City, ST 12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., +1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., alex@techcorp.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Summary ({companySummary.length}/500)
                  </label>
                  <textarea
                    value={companySummary}
                    onChange={(e) => setCompanySummary(e.target.value.slice(0, 500))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    placeholder="Brief description of your company..."
                  />
                </div>
              </div>
            </div>

            {/* Personal Photo */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Personal Photo</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Your Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePersonPhotoUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Your photo will appear as a circular profile image at the top of your card
                </p>
                {personPhoto && (
                  <button
                    onClick={() => setPersonPhoto(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            {/* Company Logo */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Company Logo</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Logo will appear in QR code center and on loading screen
                </p>
                {companyLogo && (
                  <button
                    onClick={() => setCompanyLogo(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Social Media Links</h3>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <select
                    value={socialMediaInput.platform}
                    onChange={(e) => setSocialMediaInput({ ...socialMediaInput, platform: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="">Select platform...</option>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <option key={platform.id} value={platform.name}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={socialMediaInput.url}
                    onChange={(e) => setSocialMediaInput({ ...socialMediaInput, url: e.target.value })}
                    placeholder="URL or handle"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    onClick={handleAddSocialMedia}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    Add
                  </button>
                </div>

                {socialMedia.length > 0 && (
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    {socialMedia.map((sm, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 text-indigo-600 flex-shrink-0"
                            dangerouslySetInnerHTML={{ __html: sm.icon || '' }}
                          />
                          <div>
                            <p className="font-medium text-sm text-gray-800">{sm.platform}</p>
                            <p className="text-xs text-gray-600 truncate">{sm.url}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveSocialMedia(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Card Colors */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Card Background Color</h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Choose the background color for your business card display page. QR code will always remain black & white for maximum scannability.
                </p>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Background Color
                    </label>
                    <input
                      type="color"
                      value={cardBgColor}
                      onChange={(e) => setCardBgColor(e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={cardBgColor}
                    onChange={(e) => setCardBgColor(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg w-24 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Content Background Pattern */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Content Background</h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Add a professional background pattern to the content section of your card.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Pattern
                  </label>
                  <select
                    value={contentBgPattern}
                    onChange={(e) => setContentBgPattern(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="none">None (Plain White)</option>
                    <option value="logo-repeat">Company Logo Step & Repeat</option>
                    <option value="banner-repeat">Banner Pattern</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    Step & Repeat patterns use your company logo in a subtle background
                  </p>
                </div>

                {contentBgPattern !== 'none' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <p className="text-xs text-gray-500 mt-2">
                      Higher opacity makes the pattern more prominent
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Advanced QR Options */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">QR Code Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size: {qrSize}px
                  </label>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="32"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Larger QR codes are easier to scan from a distance
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Error Correction (Damage Resistance)
                  </label>
                  <select
                    value={errorCorrection}
                    onChange={(e) => setErrorCorrection(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="L">Low (7% recovery)</option>
                    <option value="M">Medium (15% recovery)</option>
                    <option value="Q">Quartile (25% recovery)</option>
                    <option value="H">High (30% recovery)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    Higher values allow QR code to be scanned even if partially damaged
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveCard}
              disabled={isSaving}
              className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : '💾 Save & Share Card'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
