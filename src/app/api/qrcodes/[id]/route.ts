import { NextRequest, NextResponse } from 'next/server';
import { QRCode } from '@/models/BusinessCard';
import { connectDB } from '@/lib/mongodb';
import { Types } from 'mongoose';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const qrCode = await QRCode.findById(id);
    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json(qrCode);
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json({ error: 'Failed to fetch QR code' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const {
      text,
      name,
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
    } = body;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const updatedQRCode = await QRCode.findByIdAndUpdate(
      id,
      {
        text,
        name,
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
      },
      { new: true, runValidators: true }
    );

    if (!updatedQRCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json(updatedQRCode);
  } catch (error) {
    console.error('Error updating QR code:', error);
    return NextResponse.json({ error: 'Failed to update QR code' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const deletedQRCode = await QRCode.findByIdAndDelete(id);
    if (!deletedQRCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    return NextResponse.json({ error: 'Failed to delete QR code' }, { status: 500 });
  }
}
