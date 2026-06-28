# Setup Google Authentication

## Overview
Booking page sekarang dilengkapi dengan Google OAuth authentication. User dapat login dengan Google account sebelum melakukan booking.

## Setup Steps

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:5173` (for local development)
   - `http://localhost:3000` (alternative)
   - Your production domain(s) e.g., `https://yourdomain.com`
7. Copy the **Client ID**

### 2. Configure Environment Variables

Create `.env.local` file in the project root:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Replace `your_google_client_id_here` with the Client ID from Google Cloud Console.

### 3. Restart Development Server

```bash
npm run dev
```

## Features

### Authentication Methods
- **Google Login**: Click "Sign in with Google" button (real OAuth)
- **Email/Password**: Traditional email/password login (optional fallback)

### User Data Storage
When user logs in with Google:
1. User data is decoded from JWT token
2. User info is stored in localStorage:
   - Name
   - Email
   - Picture URL (if available)
   - Auth provider (google/email)

### Auto-fill Booking Form
- User's name from Google profile is pre-filled in the booking form
- User still needs to enter WhatsApp number and event details

### Session Management
- Login state is stored in localStorage as `rpnzl_user_login`
- User data stored in localStorage as `rpnzl_user_data`
- Session persists until user closes browser or clears localStorage

## File Changes

- `src/App.jsx` - Added GoogleOAuthProvider wrapper
- `src/pages/Booking.jsx` - Updated LoginModal with real Google authentication
- `package.json` - Added `@react-oauth/google` and `jwt-decode` dependencies
- `.env.local.example` - Created environment variable template

## Troubleshooting

### Google Login Button Not Showing
- Check if `VITE_GOOGLE_CLIENT_ID` is set in `.env.local`
- Make sure you added your domain to authorized redirect URIs
- Check browser console for errors

### "Client ID not configured" Warning
- This means `VITE_GOOGLE_CLIENT_ID` is missing from `.env.local`
- Follow Setup Steps above to configure

### Cannot login after Google redirects
- Check if redirect URI in Google Cloud matches your app URL
- Clear browser localStorage and try again

## Production Deployment

Before deploying to production:

1. Update Google OAuth credentials redirect URIs with your production domain
2. Set environment variables in your production environment:
   ```
   VITE_GOOGLE_CLIENT_ID=your_production_client_id
   VITE_API_BASE_URL=https://your-backend-api.com
   ```
3. Rebuild the app
4. Deploy

## API Integration

When user submits booking:
- Customer name is taken from form input (or pre-filled from Google profile)
- WhatsApp number is required from form input
- Event type, location, and notes are from form
- All data is sent to `/api/bookings` endpoint
