# QR Code Business Card Generator

A modern Next.js web application that generates QR codes for virtual business cards. Users can create, manage, and share professional digital business cards with QR code integration.

## Features

### Core Features
- 📇 **Create Business Cards** - Generate professional virtual business cards with company information
- 🔗 **QR Code Generation** - Automatic QR code creation for each business card
- 👤 **Personal Profile Routes** - Each card has a unique URL slug (e.g., `/alex`)
- 📂 **Directory Structure** - Organize cards by company directories and subdirectories
- ✏️ **Edit & Manage** - Full CRUD operations for business card management
- 📥 **Add to Contacts** - Button to add contacts to device contacts (vCard support)

### Business Card Information
Each business card displays:
- Name
- Job Title
- Company Name
- Company Summary (max 500 characters)
- Company Address
- Company Logo
- Social Media Links (with icons)
- QR Code (with download capability)

### Directory Features
- Hierarchical organization (e.g., `tech/google`, `finance/goldman-sachs`)
- Browse cards by directory structure
- View all cards in a selected directory
- Central index for easy navigation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **QR Code**: qrcode.react
- **Package Manager**: npm

## Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud - MongoDB Atlas)

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/qr-code-generator?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
/src
├── /app
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── globals.css                # Global styles
│   ├── /cards
│   │   ├── page.tsx              # All cards listing
│   │   ├── create/page.tsx        # Create new card
│   │   └── [slug]/
│   │       ├── edit/page.tsx      # Edit card
│   │       └── page.tsx           # View card details
│   ├── /[slug]/page.tsx           # Public business card view
│   ├── /directory/page.tsx        # Directory browser
│   └── /api
│       ├── /cards
│       │   ├── route.ts           # GET all cards, POST new card
│       │   └── [slug]/route.ts    # GET, PUT, DELETE specific card
│       └── /directories/route.ts  # GET directory structure
├── /components
│   ├── BusinessCardDisplay.tsx    # Card display component
│   ├── BusinessCardForm.tsx       # Card form component
│   └── QRCodeDisplay.tsx          # QR code display
├── /lib
│   └── mongodb.ts                 # MongoDB connection
├── /models
│   └── BusinessCard.ts            # Mongoose schema
```

## API Routes

### Cards
- `GET /api/cards` - Get all business cards
- `POST /api/cards` - Create new business card
- `GET /api/cards/[slug]` - Get specific card by slug
- `PUT /api/cards/[slug]` - Update card
- `DELETE /api/cards/[slug]` - Delete card

### Directories
- `GET /api/directories` - Get directory structure with cards

## Usage Guide

### Creating a Business Card
1. Navigate to "Create New Card" button
2. Fill in the required information:
   - Slug (unique URL identifier)
   - Name
   - Title
   - Company
   - Company Address
3. Optionally add:
   - Company Logo URL
   - Company Summary
   - Social Media Links
4. Click "Create Card"

### Viewing a Card
- Public URL: `http://localhost:3000/[slug]`
- Shows full card details and QR code
- Download QR code as PNG image

### Managing Cards
- View all cards: `/cards`
- Edit card: Navigate to a card and click "Edit"
- Browse by directory: `/directory`

### Sharing
Each card has a unique URL and QR code that points to:
`http://localhost:3000/[slug]`

Scan the QR code to view the business card online.

## MongoDB Schema

### BusinessCard Model
```typescript
{
  slug: string (unique, required)
  name: string (required)
  title: string (required)
  company: string (required)
  companySummary: string (max 500 chars)
  companyAddress: string (required)
  companyLogo: string (optional)
  directory: string (default: 'root')
  socialMedia: [{
    platform: string
    url: string
    icon: string
  }]
  createdAt: Date
  updatedAt: Date
}
```

## Future Enhancements

- [ ] vCard (.vcf) file generation and download
- [ ] Batch import from CSV
- [ ] More social media platforms
- [ ] Custom card templates
- [ ] Card usage analytics
- [ ] Email sharing
- [ ] Mobile app
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Advanced image upload with cloud storage

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.
