# Google Authentication Flow Documentation

## User Flow Diagram

```
User visits Booking page
    ↓
    ├─ User is NOT logged in
    │  └─ Show "Sign in to book" button
    │      ↓
    │      User clicks button → LoginModal opens
    │      ↓
    │      ├─ Option 1: Google Login (NEW - REAL OAUTH)
    │      │  ├─ User clicks "Sign in with Google" button
    │      │  ├─ Google OAuth popup appears
    │      │  ├─ User authenticates with Google
    │      │  ├─ JWT token returned to app
    │      │  ├─ Token decoded using jwt-decode
    │      │  ├─ User data extracted (name, email, picture)
    │      │  ├─ Data stored in localStorage:
    │      │  │   - rpnzl_user_login: 'true'
    │      │  │   - rpnzl_user_data: JSON object
    │      │  └─ LoginModal closes, form shows
    │      │
    │      └─ Option 2: Email/Password (Traditional)
    │         └─ User enters email & password
    │            └─ Form submitted
    │               └─ Data stored in localStorage
    │
    ├─ User IS logged in
    │  └─ Show booking form with fields:
    │     - Name (pre-filled from Google if available)
    │     - WhatsApp number (required)
    │     - Event type (dropdown/text)
    │     - Location (required)
    │     - Notes (optional)
    │
    └─ User fills form and submits
       ├─ Validate all required fields
       ├─ Get package ID from selected category
       ├─ POST to /api/bookings with:
       │  ├─ package_id
       │  ├─ schedule_id
       │  ├─ booking_date
       │  ├─ booking_time
       │  ├─ event_type
       │  ├─ location
       │  ├─ customization_notes
       │  └─ customer: { name, whatsapp_number }
       │
       └─ Handle response
          ├─ If success: Show WhatsApp redirect or confirmation
          └─ If error: Show error message
```

## Code Implementation Details

### 1. GoogleLogin Component Integration

**File**: `src/pages/Booking.jsx` (LoginModal)

```jsx
<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
  text="signin_with"
  size="large"
/>
```

**Props**:
- `onSuccess` - Callback when login succeeds (receives credentialResponse)
- `onError` - Callback when login fails
- `text` - Button text variant ("signin_with" shows "Sign in with Google")
- `size` - Button size ("large" for bigger button)

### 2. Token Handling

```jsx
const handleGoogleSuccess = (credentialResponse) => {
  // credentialResponse.credential contains JWT token
  const decoded = jwtDecode(credentialResponse.credential);
  
  // Extract user info from decoded token
  const userData = {
    name: decoded.name,
    email: decoded.email,
    picture: decoded.picture,
    provider: 'google',
  };
  
  // Store in localStorage
  localStorage.setItem('rpnzl_user_login', 'true');
  localStorage.setItem('rpnzl_user_data', JSON.stringify(userData));
  
  // Call parent callback
  onLogin(userData);
};
```

### 3. Booking Form Auto-fill

```jsx
// In handleSubmit function
const userDataStr = localStorage.getItem('rpnzl_user_data');
const userData = userDataStr ? JSON.parse(userDataStr) : {};

// Use form input first, fallback to Google data
const customerName = form.name || userData.name || '';
```

## localStorage Structure

### Session Keys

**rpnzl_user_login** (string)
```
'true' - User is logged in
```

**rpnzl_user_data** (JSON string)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "picture": "https://lh3.googleusercontent.com/...",
  "provider": "google"
}
```

## Environment Configuration

### Required Environment Variable

Create `.env.local` file:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

### How App Uses It

**File**: `src/App.jsx`
```jsx
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

return (
  <GoogleOAuthProvider clientId={googleClientId || ''}>
    {/* App content */}
  </GoogleOAuthProvider>
);
```

## Security Considerations

1. **JWT Tokens**: Decoded client-side, never sent to backend
   - JWT is cryptographically signed by Google
   - Only displayed token content is extracted
   - No sensitive data exposed

2. **localStorage**: 
   - Only stores public user profile data
   - No passwords or tokens stored
   - User info accessible to user's own browser only

3. **CORS & Redirect URIs**:
   - Google verifies redirect URI matches configured URIs
   - Prevents token hijacking to unauthorized domains
   - Must configure all deployment domains in Google Cloud Console

4. **API Communication**:
   - Booking data sent to backend via HTTPS (recommended for production)
   - Backend should validate all required fields
   - Backend receives customer info only (no auth tokens)

## Testing Checklist

- [ ] Google Client ID configured in .env.local
- [ ] GoogleLogin button appears in LoginModal
- [ ] Can click button and see Google auth popup
- [ ] After successful auth, user data stored in localStorage
- [ ] Form pre-fills with user name from Google
- [ ] Can submit booking with WhatsApp number
- [ ] Logout clears localStorage (optional feature to implement)
- [ ] Email/password form still works as fallback

## Future Enhancements

1. **Logout Button**: Clear localStorage and show login button again
2. **Facebook OAuth**: Similar implementation with facebook-sdk
3. **Backend Integration**: Validate auth tokens from backend
4. **User Profile Page**: Show logged-in user info and edit profile
5. **Refresh Token**: Keep user logged in across sessions
6. **Rate Limiting**: Prevent booking abuse by limiting per user
