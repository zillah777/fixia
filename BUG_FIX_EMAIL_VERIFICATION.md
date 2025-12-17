# 🔴 Critical Bug Fix: Email Verification Token Undefined

## Issue Description

When registering a new account, users received a verification email with an invalid link:
```
https://fixia.app/auth/verify-email?token=undefined
```

Clicking this link resulted in error: **"Verificacion fallida"** (Verification failed)

## Root Cause Analysis

The bug was in `src/app/api/auth/register/route.ts` at **line 95**:

### Before (BROKEN):
```typescript
sendVerificationEmail(email, verificationToken)
```

### The Function Signature (in src/lib/mail.ts):
```typescript
export const sendVerificationEmail = async (
  email: string,
  name: string,      // ← MISSING in register/route.ts call!
  token: string
) => { ... }
```

### What Happened:
1. Register endpoint called with **2 arguments**: `email`, `verificationToken`
2. Function expected **3 arguments**: `email`, `name`, `token`
3. JavaScript mapped parameters as:
   - `email` → `email` ✅
   - `verificationToken` → `name` (WRONG!)
   - `undefined` → `token` ❌

4. The email template then used `${confirmLink}` which became:
   ```
   const confirmLink = `${appUrl}/auth/verify-email?token=${token}`;
   // where token = undefined
   ```

5. Result: `https://fixia.app/auth/verify-email?token=undefined`

## Solution

### After (FIXED):
```typescript
sendVerificationEmail(email, name, verificationToken)
```

Now the parameters map correctly:
- `email` → `email` ✅
- `name` → `name` ✅
- `verificationToken` → `token` ✅

The email link now correctly includes the valid UUID token:
```
https://fixia.app/auth/verify-email?token=<valid-uuid>
```

## Files Modified

| File | Change | Line |
|------|--------|------|
| `src/app/api/auth/register/route.ts` | Add `name` parameter | 95 |

## Verification of Fix

### Resend Endpoint (Already Correct)
The `/api/auth/resend-verification` endpoint was already calling the function correctly:
```typescript
sendVerificationEmail(user.email, user.name, newToken)
```
This is why resend was working (when token wasn't expired).

### Email HTML Template (No Changes Needed)
The email template in `src/lib/mail.ts` was correct:
```typescript
const confirmLink = `${appUrl}/auth/verify-email?token=${token}`;
const html = generateVerificationEmailHTML(confirmLink);
```
It correctly used the `token` parameter passed to the function.

## Impact

**Severity**: 🔴 CRITICAL

- **Before Fix**: 100% of new registrations would get invalid verification links
- **After Fix**: All new registrations get valid, working verification links
- **User Flow**: Completely broken → Now fully operational

## Testing

To verify the fix works:

1. Register a new account at `/register`
2. Check the verification email
3. Verify the link contains a valid UUID token (not `undefined`)
4. Click the verification link
5. Should see success message and be able to login

## Example Valid Token

```
URL: https://fixia.app/auth/verify-email?token=550e8400-e29b-41d4-a716-446655440000
Status: ✅ VALID
```

## Example Invalid Token (Before Fix)

```
URL: https://fixia.app/auth/verify-email?token=undefined
Status: ❌ INVALID
```

---

**Git Commit**: `f9605c2`
**Date Fixed**: 2025-12-16
**Status**: ✅ DEPLOYED
