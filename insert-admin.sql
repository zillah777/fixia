INSERT INTO "User" (id, email, name, password, role, status, "completedOnboarding", "subscriptionStatus", "listingVisible", "createdAt", "updatedAt") 
VALUES (
  'b89bf8a2-b721-48af-8ca9-ad3cc0952251', 
  'admin@fixia.app', 
  'Admin Fixia', 
  '$2a$10$i9/3ULbVOTDAJWj/POeaBepeoyno2Xh9whfNytTGo2cS3rEYNjpee', 
  'ADMIN', 
  'ACTIVE', 
  true, 
  'active', 
  true, 
  NOW(), 
  NOW()
);
