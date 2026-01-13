# Authentication Flow Test Guide

## Testing the Protected Route Redirect Flow

### Scenario 1: Direct Dashboard Access (Not Authenticated)
1. Make sure you're **not logged in** (sign out if needed)
2. Go to: `http://localhost:3000/dashboard`
3. **Expected Result**: 
   - You'll be redirected to `http://localhost:3000/?redirectTo=/dashboard`
   - Sign-in modal will automatically open
   - After successful login, you'll be redirected back to `/dashboard`

### Scenario 2: Already Authenticated
1. Make sure you're **logged in**
2. Go to: `http://localhost:3000/dashboard`
3. **Expected Result**: 
   - Dashboard loads immediately
   - No redirect happens

### Scenario 3: Sign In and Return
1. Start not logged in
2. Visit: `http://localhost:3000/dashboard`
3. Get redirected to home with sign-in modal
4. Enter valid credentials and sign in
5. **Expected Result**: 
   - Automatically redirected to `/dashboard`
   - Dashboard loads with your session

### Scenario 4: Deep Link Protection
1. Not logged in
2. Visit: `http://localhost:3000/dashboard/analytics`
3. **Expected Result**: 
   - Redirected to `http://localhost:3000/?redirectTo=/dashboard/analytics`
   - Sign-in modal opens
   - After login, redirected to `/dashboard/analytics`

## How It Works

1. **Middleware** (`middleware.ts`):
   - Checks if route starts with `/dashboard`
   - Validates Supabase session
   - If no session → redirect to `/?redirectTo={original-path}`

2. **Navbar Component**:
   - Reads `redirectTo` query parameter
   - Automatically opens sign-in modal if parameter exists
   - Passes parameter to SignInModal

3. **SignInModal**:
   - Reads `redirectTo` from URL params
   - After successful login, redirects to `redirectTo` path
   - Falls back to `/dashboard` if no `redirectTo` parameter

4. **AuthProvider**:
   - Manages global auth state
   - Handles session persistence
   - Triggers redirects on auth state changes

## Testing Different Scenarios

```bash
# Test 1: Protected route (not logged in)
curl -I http://localhost:3000/dashboard

# Test 2: Check redirect URL
# Open browser and check URL bar after accessing /dashboard while logged out

# Test 3: Deep link protection
# Try accessing: /dashboard/settings, /dashboard/links, etc.
```

## Expected Flow Diagram

```
User tries to access /dashboard
         ↓
Middleware checks session
         ↓
    No session?
         ↓
Redirect to /?redirectTo=/dashboard
         ↓
Navbar detects redirectTo parameter
         ↓
Auto-opens SignInModal
         ↓
User signs in successfully
         ↓
Redirect to /dashboard (from redirectTo)
         ↓
Dashboard loads with active session
```

## Troubleshooting

If the flow doesn't work as expected:

1. **Modal doesn't open**: 
   - Check browser console for errors
   - Verify `useSearchParams()` is working
   - Check Suspense boundary in ConditionalLayout

2. **Redirect doesn't work**:
   - Check middleware logs
   - Verify Supabase env variables
   - Check browser cookies (Supabase session)

3. **Redirects to wrong page**:
   - Clear browser localStorage
   - Clear cookies
   - Hard refresh (Cmd/Ctrl + Shift + R)

## API Testing

Test the auth API endpoints:

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get user session
curl http://localhost:3000/api/auth/user

# Sign out
curl -X POST http://localhost:3000/api/auth/signout
```