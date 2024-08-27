import { eq } from "drizzle-orm";
import { describe } from "vitest";

import { PaymentRequestDocs, PaymentRequests } from "@/drizzle/schema";
import { withValidPlatformAndUser } from "@/test/integration/contexts/users";
import { testWithDb, type TestDbType } from "@/test/integration/fixtures/db-fixtures";
import { useCaller } from "@/test/integration/helpers/test-caller";
import { buildTestSession } from "@/test/integration/helpers/test-session";
import { TRPCError } from "@trpc/server";

describe.concurrent("paymentRequest API", () => {
  describe("without session", () => {
    const session = null;

    testWithDb("get returns UNAUTHORIZED", async ({ expect, db }) => {
      const { caller } = useCaller({ db, session });
      await expect(
        caller.paymentRequest.create({
          eBlId: "bl123",
          payerBusinessUnitId: "123",
          invoiceAmount: "100.00",
          message: "Test message",
          docs: [{ fileName: "test.pdf", docId: "doc1", docType: "invoice" }],
        }),
      ).rejects.toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });
  });

  describe("with valid session", async () => {
    const useSession = async (db: TestDbType) => {
      const { user, platform } = await withValidPlatformAndUser(db);
      return { session: buildTestSession({ platform, user }), user, platform };
    };

    describe("get", () => {
      testWithDb("get returns the correct payment request", async ({ expect, db }) => {
        const { session, platform, user } = await useSession(db);
        const { caller } = useCaller({ db, session });

        // Create a payment request to be fetched later
        const input = {
          eBlId: "bl12345",
          payerBusinessUnitId: "123",
          invoiceAmount: "500.0000",
          message: "Fetch this payment request",
          docs: [
            { fileName: "fetch1.pdf", docId: "doc1", docType: "invoice" },
            { fileName: "fetch2.pdf", docId: "doc2", docType: "receipt" },
          ],
        };

        // Insert payment request into the database
        const [paymentRequest] = await db
          .insert(PaymentRequests)
          .values({
            eBlId: input.eBlId,
            payerBusinessUnitId: input.payerBusinessUnitId,
            invoiceAmount: input.invoiceAmount,
            message: input.message,
            requesterBusinessUnitId: session.businessUnitId,
            requestUserId: BigInt(user.id),
            requestPlatformId: BigInt(platform.id),
          })
          .returning();

        // Insert associated documents into the database
        await db.insert(PaymentRequestDocs).values(
          input.docs.map((doc) => ({
            paymentRequestId: paymentRequest!.id,
            fileName: doc.fileName,
            docId: doc.docId,
            docType: doc.docType,
          })),
        );

        // Fetch the created payment request
        const fetchedPaymentRequest = await caller.paymentRequest.get({ eBlId: input.eBlId });

        // Check if the fetched payment request matches the created one
        expect(fetchedPaymentRequest).toMatchObject({
          eBlId: input.eBlId,
          payerBusinessUnitId: input.payerBusinessUnitId,
          invoiceAmount: input.invoiceAmount,
          message: input.message,
        });
        expect(fetchedPaymentRequest?.PaymentRequestDocs).toHaveLength(2);
        expect(fetchedPaymentRequest?.PaymentRequestDocs[0]).toMatchObject({
          fileName: input.docs[0]!.fileName,
          docId: input.docs[0]!.docId,
          docType: input.docs[0]!.docType,
        });
        expect(fetchedPaymentRequest?.PaymentRequestDocs[1]).toMatchObject({
          fileName: input.docs[1]!.fileName,
          docId: input.docs[1]!.docId,
          docType: input.docs[1]!.docType,
        });
      });
    });

    describe("create payment request", () => {
      testWithDb("creates a payment request and associated documents", async ({ expect, db }) => {
        const { session, platform, user } = await useSession(db);
        const { caller } = useCaller({ db, session });

        const input = {
          eBlId: "bl16888",
          payerBusinessUnitId: "123",
          invoiceAmount: "16888.0000",
          message: "Test message",
          docs: [
            { fileName: "test1.pdf", docId: "doc1", docType: "invoice" },
            { fileName: "test2.pdf", docId: "doc2", docType: "receipt" },
          ],
        };

        const paymentRequestId = await caller.paymentRequest.create(input);

        // Check if the payment request was created
        const paymentRequest = await db.select().from(PaymentRequests).where(eq(PaymentRequests.id, paymentRequestId!));

        expect(paymentRequest).toHaveLength(1);
        expect(paymentRequest[0]).toMatchObject({
          payerBusinessUnitId: input.payerBusinessUnitId,
          invoiceAmount: input.invoiceAmount,
          message: input.message,
          requesterBusinessUnitId: session.businessUnitId,
          requestPlatformId: platform.id,
          requestUserId: BigInt(user.id),
        });

        // Check if the associated documents were created
        const docs = await db
          .select()
          .from(PaymentRequestDocs)
          .where(eq(PaymentRequestDocs.paymentRequestId, paymentRequestId!));
        expect(docs).toHaveLength(2);
        input.docs.forEach((inputDoc) => {
          const matchingDoc = docs.find((doc) => doc.fileName === inputDoc.fileName);
          expect(matchingDoc).toBeTruthy();
          expect(matchingDoc).toMatchObject({
            fileName: inputDoc.fileName,
            docId: inputDoc.docId,
            docType: inputDoc.docType,
            paymentRequestId: paymentRequestId,
          });
        });
      });
    });
  });
});
