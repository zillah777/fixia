# Identity Verification System - Implementation Guide

## Overview

The identity verification system allows users (both CLIENT and PROFESSIONAL) to submit their identity documents (DNI - two sides) for admin review. Once approved, users gain access to key features like creating services, receiving bookings, and having their listings visible.

---

## Endpoints

### 1. User: Submit Verification Request
**POST** `/api/verifications`

**Authentication**: Required (User session)

**Description**: Submit identity verification documents (DNI front and back images)

**Request Body**:
```json
{
  "idFront": "base64_or_url_of_front_side",
  "idBack": "base64_or_url_of_back_side",
  "certificationUrl": "optional_certification_image_url"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "verification": {
    "id": "verification-uuid",
    "status": "PENDING",
    "createdAt": "2025-12-16T23:40:00Z",
    "message": "Solicitud de verificación enviada. El administrador la revisará en breve."
  }
}
```

**Possible Errors**:
- `400 Bad Request`: Invalid image data format
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: User not found
- `409 Conflict`: User already has pending verification request

---

### 2. User: Check Verification Status
**GET** `/api/verifications`

**Authentication**: Required (User session)

**Description**: Check the current verification status of the authenticated user

**Response (200 OK)**:
```json
{
  "id": "verification-uuid",
  "status": "PENDING",
  "createdAt": "2025-12-16T23:40:00Z",
  "updatedAt": "2025-12-16T23:40:00Z",
  "adminNote": null
}
```

**Or if no verification exists**:
```json
{
  "status": "NO_REQUEST",
  "message": "No tienes solicitudes de verificación"
}
```

---

### 3. Admin: Review Verification Request
**PATCH** `/api/admin/verifications/[id]`

**Authentication**: Required (Admin role)

**Description**: Review and approve/reject a verification request

**Request Body**:
```json
{
  "status": "APPROVED",
  "adminNote": "DNI documents verified successfully"
}
```

**Status Options**: `APPROVED`, `REJECTED`, `PENDING`

**Response (200 OK)**:
```json
{
  "success": true,
  "verification": {
    "id": "verification-uuid",
    "userId": "user-uuid",
    "idFront": "image_url",
    "idBack": "image_url",
    "status": "APPROVED",
    "adminNote": "DNI documents verified successfully",
    "createdAt": "2025-12-16T23:40:00Z",
    "updatedAt": "2025-12-16T23:42:00Z",
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "PROFESSIONAL"
    }
  },
  "message": "Verification approved successfully"
}
```

**Possible Errors**:
- `400 Bad Request`: Invalid status value
- `401 Unauthorized`: Not an admin
- `404 Not Found`: Verification request not found
- `500 Internal Server Error`: Database error

---

## User Flow

### For CLIENT Users:
```
1. Register as CLIENT
2. Verify email address
3. Login to dashboard
4. Navigate to Identity Verification section
5. Upload DNI front and back images
6. Submit for admin review
7. Wait for admin approval (can check status anytime)
8. Once APPROVED:
   - Can convert to PROFESSIONAL by paying subscription
   - Can act as CLIENT and place service requests
```

### For PROFESSIONAL Users:
```
1. Register as PROFESSIONAL
2. Verify email address
3. Login to dashboard
4. Pay subscription fee (mandatory for professionals)
5. Webhook approval activates professional features
6. (Optional) Submit identity verification for trust badge
7. Upload DNI front and back images
8. Submit for admin review
9. Once APPROVED:
   - Get VERIFIED badge on profile
   - Increased visibility and trust
   - Able to receive more bookings
```

---

## Admin Review Process

### Dashboard
Admins can view pending verifications at `/admin/verifications`

### Review Checklist:
- [ ] DNI images are clear and readable
- [ ] Name matches the registered user name
- [ ] DNI is not expired
- [ ] Images show both front and back
- [ ] Face is visible and matches other identity documents

### Actions:
1. **APPROVED**: User gains permissions and trust
2. **REJECTED**: Provide reason in adminNote so user can resubmit

---

## Data Storage

### Database Schema:
```prisma
model VerificationRequest {
  id               String   @id @default(uuid())
  userId           String   @unique  # One verification per user
  idFront          String   # Front side of DNI (image URL or base64)
  idBack           String   # Back side of DNI (image URL or base64)
  certificationUrl String?  # Optional professional certification
  status           String   @default("PENDING")  # PENDING, APPROVED, REJECTED
  adminNote        String?  # Reason for approval/rejection
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  user             User     @relation(...)
}
```

---

## Statuses and Permissions

### Verification Status Flow:
```
PENDING
├─ Admin reviews documents
├─→ APPROVED (User gains permissions)
└─→ REJECTED (User can resubmit)
```

### User Permissions After Approval:
- ✅ `canCreateServices: true` - Can create service listings
- ✅ `listingVisible: true` - Services visible in marketplace
- ✅ `canReceiveBookings: true` - Can receive booking requests
- ✅ VERIFIED badge on profile

### User Permissions After Rejection:
- ❌ `canCreateServices: false`
- ❌ `listingVisible: false`
- ❌ `canReceiveBookings: false`

User can resubmit new documents after rejection.

---

## Security Considerations

1. **Image Handling**:
   - Images stored as base64 strings or external URLs
   - Consider adding image size/format validation
   - Sanitize filenames

2. **Access Control**:
   - Only authenticated users can submit
   - Only admins can review
   - Each user can only have one active verification

3. **Data Privacy**:
   - DNI information is sensitive
   - Admins should have access logs
   - Consider encryption for stored documents

4. **Abuse Prevention**:
   - Rate limiting on verification submissions
   - Maximum resubmission attempts?
   - Admin audit trail for approvals/rejections

---

## API Examples

### JavaScript/TypeScript Client

#### Submit Verification:
```typescript
const submitVerification = async (idFrontData: string, idBackData: string) => {
  const response = await fetch('/api/verifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idFront: idFrontData,  // base64 or URL
      idBack: idBackData,    // base64 or URL
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
};
```

#### Check Status:
```typescript
const checkVerificationStatus = async () => {
  const response = await fetch('/api/verifications');
  return await response.json();
};
```

#### Admin Review:
```typescript
const approveVerification = async (verificationId: string, note: string) => {
  const response = await fetch(`/api/admin/verifications/${verificationId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'APPROVED',
      adminNote: note
    })
  });

  return await response.json();
};
```

---

## Error Handling

### Common Errors:

| Error | Cause | Solution |
|-------|-------|----------|
| `Ya tienes una solicitud de verificación pendiente` | Duplicate request | Wait for admin review or contact support |
| `Datos inválidos` | Invalid image data | Ensure images are valid base64 or URLs |
| `Autenticación requerida` | Not logged in | Login first |
| `Usuario no encontrado` | User record missing | Contact support |
| `Unauthorized` (admin endpoint) | Not an admin | Only admins can review |

---

## Future Enhancements

1. **Image Validation**:
   - Automated OCR for DNI reading
   - Face detection for photo validation
   - Image quality scoring

2. **KYC Integration**:
   - Connect with third-party KYC services
   - Automated verification

3. **Document Types**:
   - Support multiple document types (passport, license, etc.)
   - Professional certifications

4. **Notifications**:
   - Email user when verification status changes
   - Notify admin of pending reviews

5. **Audit Trail**:
   - Log all verification actions
   - Track who approved/rejected and when

---

## Testing

### Test Scenarios:

1. **Happy Path**:
   - User submits valid DNI images
   - Admin approves
   - Verify permissions are set

2. **Rejection Path**:
   - User submits invalid images
   - Admin rejects with reason
   - User can resubmit

3. **Duplicate Prevention**:
   - User tries to submit twice
   - Second submission rejected with 409 error

4. **Authentication**:
   - Unauthenticated user cannot submit: 401
   - Non-admin cannot approve: 401

---

**Status**: ✅ IMPLEMENTED AND READY
**Deployment**: Docker rebuild in progress
**Documentation**: Complete
