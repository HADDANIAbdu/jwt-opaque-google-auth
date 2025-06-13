# Legal App - Next.js Version

This is a Next.js version of the legal document management application, featuring:

## Features

- **Authentication**: Login/Register with email/password and Google OAuth
- **Dashboard**: View and manage legal documents
- **Profile Management**: Update user profile and photo upload
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Arabic RTL Support**: Full right-to-left text direction support

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **js-cookie**: Cookie management

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── profile/          # Profile page
│   ├── register/         # Registration page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   └── Header.tsx       # Navigation header
├── lib/                 # Utility libraries
│   └── auth-service.ts  # Authentication service
├── types/               # TypeScript type definitions
│   └── index.ts
└── public/              # Static assets
```

## API Integration

The app connects to a backend API running on `http://localhost:8080/api` with the following endpoints:

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/url` - Google OAuth URL
- `GET /auth/callback` - OAuth callback
- `GET /profile` - User profile
- `GET /documents` - User documents
- `POST /add-photo` - Upload profile photo

## Environment Setup

Make sure your backend API is running on port 8080, or update the `API_URL` in `lib/auth-service.ts` to match your backend URL.

## Features Comparison with Angular Version

This Next.js version maintains feature parity with the original Angular application:

✅ User authentication (email/password + Google OAuth)
✅ Dashboard with document display
✅ Profile management with photo upload
✅ Responsive design with Arabic RTL support
✅ Form validation and error handling
✅ Local storage for user data persistence

## Build and Deploy

To build for production:

```bash
npm run build
npm start
```

The application will be optimized and ready for deployment.