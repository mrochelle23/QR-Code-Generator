import mongoose from 'mongoose';

interface IQRCode extends mongoose.Document {
  userId: string;
  slug: string; // Unique URL slug for the card page
  // QR Code content
  text: string;
  name: string;
  // Business card info
  personName: string;
  personTitle: string;
  company: string;
  companyAddress: string;
  companySummary: string;
  phone?: string; // Phone number
  email?: string; // Email address
  personPhoto?: string; // Base64 personal photo for card display
  companyLogo?: string; // Base64 company logo for QR center and loading screen
  socialMedia: {
    platform: string;
    url: string;
    icon?: string;
  }[];
  // Card Display customization
  cardBgColor: string; // Background color for the card display page
  contentBgPattern?: string; // Background pattern for content section: 'none', 'logo-repeat', 'banner-repeat'
  contentBgOpacity?: number; // Opacity of background pattern (0-100)
  qrSize: number;
  errorCorrection: string;
  createdAt: Date;
  updatedAt: Date;
}

const qrCodeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    personName: {
      type: String,
      default: '',
      trim: true,
    },
    personTitle: {
      type: String,
      default: '',
      trim: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    companyAddress: {
      type: String,
      default: '',
      trim: true,
    },
    companySummary: {
      type: String,
      default: '',
      maxlength: 500,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    personPhoto: {
      type: String,
      default: null,
    },
    companyLogo: {
      type: String,
      default: null,
    },
    socialMedia: [
      {
        platform: String,
        url: String,
        icon: String,
        _id: false,
      },
    ],
    cardBgColor: {
      type: String,
      default: '#FFFFFF',
    },
    contentBgPattern: {
      type: String,
      enum: ['none', 'logo-repeat', 'banner-repeat'],
      default: 'none',
    },
    contentBgOpacity: {
      type: Number,
      default: 15,
      min: 0,
      max: 100,
    },
    qrSize: {
      type: Number,
      default: 256,
    },
    errorCorrection: {
      type: String,
      default: 'M',
    },
  },
  {
    timestamps: true,
  }
);

export const QRCode =
  mongoose.models.QRCode ||
  mongoose.model<IQRCode>('QRCode', qrCodeSchema);

export type { IQRCode };
