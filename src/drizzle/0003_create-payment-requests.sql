DO $$ BEGIN
 CREATE TYPE "public"."PaymentRequestStatus" AS ENUM('REQUESTED', 'PAID', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'EXPIRED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PaymentRequestDoc" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"paymentRequestId" bigint,
	"fileName" text NOT NULL,
	"docId" text,
	"docType" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PaymentRequest" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"eBlId" text NOT NULL,
	"status" "PaymentRequestStatus" DEFAULT 'REQUESTED' NOT NULL,
	"requestPlatformId" bigint,
	"requestUserId" bigint,
	"requesterBusinessUnitId" text NOT NULL,
	"payerBusinessUnitId" text NOT NULL,
	"invoiceAmount" numeric(24, 4) NOT NULL,
	"message" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "DocImage" ALTER COLUMN "docFileId" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PaymentRequestDoc" ADD CONSTRAINT "PaymentRequestDoc_paymentRequestId_PaymentRequest_id_fk" FOREIGN KEY ("paymentRequestId") REFERENCES "public"."PaymentRequest"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
