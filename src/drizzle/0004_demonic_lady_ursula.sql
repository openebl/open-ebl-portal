CREATE TABLE IF NOT EXISTS "DocExtraction" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	"result" jsonb,
	"error" text
);
