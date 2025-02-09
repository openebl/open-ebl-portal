ALTER TABLE "User" DROP CONSTRAINT "User_activePlatformId_fkey";
--> statement-breakpoint
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";
--> statement-breakpoint
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";
--> statement-breakpoint
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";
--> statement-breakpoint
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_platformId_fkey";
--> statement-breakpoint
ALTER TABLE "DocImage" DROP CONSTRAINT "DocImage_docFileId_fkey";
--> statement-breakpoint
ALTER TABLE "DocFile" DROP CONSTRAINT "DocFile_uploaderId_fkey";
--> statement-breakpoint
DROP INDEX IF EXISTS "VerificationToken_identifier_token_key";--> statement-breakpoint
DROP INDEX IF EXISTS "VerificationToken_token_key";--> statement-breakpoint
DROP INDEX IF EXISTS "User_email_key";--> statement-breakpoint
DROP INDEX IF EXISTS "Account_provider_providerAccountId_key";--> statement-breakpoint
DROP INDEX IF EXISTS "Session_sessionToken_key";--> statement-breakpoint
DROP INDEX IF EXISTS "UserRole_userId_platformId_role_key";--> statement-breakpoint
DROP INDEX IF EXISTS "Platform_platformId_key";--> statement-breakpoint
DROP INDEX IF EXISTS "DocFile_uuid_key";--> statement-breakpoint
ALTER TABLE "Account" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Account" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_activePlatformId_Platform_id_fk" FOREIGN KEY ("activePlatformId") REFERENCES "public"."Platform"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_platformId_Platform_id_fk" FOREIGN KEY ("platformId") REFERENCES "public"."Platform"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DocImage" ADD CONSTRAINT "DocImage_docFileId_DocFile_id_fk" FOREIGN KEY ("docFileId") REFERENCES "public"."DocFile"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DocFile" ADD CONSTRAINT "DocFile_uploaderId_User_id_fk" FOREIGN KEY ("uploaderId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken" USING btree ("identifier","token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account" USING btree ("provider","providerAccountId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session" USING btree ("sessionToken");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "UserRole_userId_platformId_role_key" ON "UserRole" USING btree ("userId","platformId","role");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Platform_platformId_key" ON "Platform" USING btree ("platformId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "DocFile_uuid_key" ON "DocFile" USING btree ("uuid");