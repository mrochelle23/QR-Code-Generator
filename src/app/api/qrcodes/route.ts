import { NextRequest, NextResponse } from 'next/server';
import { QRCode } from '@/models/BusinessCard';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const qrCodes = await QRCode.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(qrCodes);
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return NextResponse.json({ error: 'Failed to fetch QR codes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      text,
      name,
      slug,
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
      userId,
    } = body;

    if (!text || !name || !slug || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields (text, name, slug, userId)' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCard = await QRCode.findOne({ slug });
    if (existingCard) {
      return NextResponse.json(
        { error: 'This slug is already taken. Please choose a different name.' },
        { status: 400 }
      );
    }

    const newQRCode = new QRCode({
      userId,
      slug,
      text,
      name,
      personName: personName || '',
      personTitle: personTitle || '',
      company: company || '',
      companyAddress: companyAddress || '',
      companySummary: companySummary || '',
      phone: phone || '',
      email: email || '',
      personPhoto: personPhoto || null,
      companyLogo: companyLogo || null,
      socialMedia: socialMedia || [],
      cardBgColor: cardBgColor || '#FFFFFF',
      contentBgPattern: contentBgPattern || 'none',
      contentBgOpacity: contentBgOpacity || 15,
      qrSize: qrSize || 256,
      errorCorrection: errorCorrection || 'M',
    });

    await newQRCode.save();
    return NextResponse.json(newQRCode, { status: 201 });
  } catch (error) {
    console.error('Error creating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to create QR code' },
      { status: 500 }
    );
  }
}
