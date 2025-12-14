CREATE VIEW "DeletedUsersList" AS
 SELECT "User".id,
    "User".name,
    "User".email,
    "User"."deletedAt",
    age(now(), "User"."deletedAt"::timestamp with time zone) AS time_since_deletion
   FROM "User"
  WHERE "User"."deletedAt" IS NOT NULL
  ORDER BY "User"."deletedAt" DESC;
