CREATE TABLE IF NOT EXISTS "Requester" (
	"id" text PRIMARY KEY NOT NULL,
	"session" text,
	"platformId" bigint,
	"userId" bigint,
	"ip" text,
	"userAgent" text,
	"acceptLanguage" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserAgreement" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"userId" bigint,
	"platformId" bigint,
	"requesterId" text NOT NULL,
	"service" text NOT NULL,
	"name" text NOT NULL,
	"version" integer,
	"acceptedAt" timestamp (3),
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "DocFile" DROP CONSTRAINT "DocFile_uploaderId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "DocFile" ALTER COLUMN "uploaderId" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserAgreement" ADD CONSTRAINT "UserAgreement_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "UserAgreement_user_service_name_key" ON "UserAgreement" USING btree ("userId","service","name","version");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DocFile" ADD CONSTRAINT "DocFile_uploaderId_User_id_fk" FOREIGN KEY ("uploaderId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
