import { activePlatformUsers } from "@/daemons/email-notifiers/utils";
import { EBlStashes, PaymentRequestDocs, PaymentRequests, Platforms, Users } from "@/drizzle/schema";
import PaymentMadeNotification from "@/emails/payment-made-notification";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { render } from "@react-email/components";
import { eq, ne, sql } from "drizzle-orm";
import { z } from "zod";

export const paymentRequestRouter = createTRPCRouter({
  get: protectedProcedure.input(z.object({ eBlId: z.string() })).query(async ({ ctx, input }) => {
    const result = await ctx.db.query.PaymentRequests.findFirst({
      where: eq(PaymentRequests.eBlId, input.eBlId),
      with: {
        PaymentRequestDocs: true,
      },
    });

    return result;
  }),

  create: protectedProcedure
    .input(
      z.object({
        eBlId: z.string(),
        payerBusinessUnitId: z.string(),
        invoiceAmount: z.string(),
        message: z.string(),
        docs: z.array(
          z.object({
            fileName: z.string(),
            docId: z.string(),
            docType: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db.execute(sql`
        WITH inserted_payment_request AS (
          INSERT INTO ${PaymentRequests} ("eBlId","payerBusinessUnitId","invoiceAmount","message","requesterBusinessUnitId","requestUserId","requestPlatformId")
          VALUES (
            ${input.eBlId},
            ${input.payerBusinessUnitId},
            ${input.invoiceAmount},
            ${input.message},
            ${ctx.session.businessUnitId},
            ${BigInt(ctx.session.user.id)},
            ${BigInt(ctx.session.platform.id)}
          )
          RETURNING id
        ),
        inserted_docs AS (
          INSERT INTO ${PaymentRequestDocs} ("paymentRequestId","fileName","docId","docType")
          SELECT
            (SELECT id FROM inserted_payment_request),
            value->>'fileName',
            value->>'docId',
            value->>'docType'
          FROM json_array_elements(${JSON.stringify(input.docs)}::text::json)
          RETURNING 1
        )
        SELECT id FROM inserted_payment_request
      `);

      return typeof result?.id === "string" ? BigInt(result.id) : null;
    }),

  confirmPayment: protectedProcedure.input(z.object({ eBlId: z.string() })).mutation(async ({ ctx, input }) => {
    await ctx.db.update(PaymentRequests).set({ status: "CONFIRMED" }).where(eq(PaymentRequests.eBlId, input.eBlId));
  }),

  markPaymentPaid: publicProcedure.input(z.object({ eBlId: z.string() })).mutation(async ({ ctx, input }) => {
    await ctx.db.update(PaymentRequests).set({ status: "PAID" }).where(eq(PaymentRequests.eBlId, input.eBlId));

    // send email to the consignee
    // const ebl = await ctx.db.query.EBlStashes.findFirst({
    //   where: eq(EBlStashes.eBlId, input.eBlId),
    // });
    // if (!ebl) return false;
    // const platform = await ctx.db.query.Platforms.findFirst({
    //   where: eq(Platforms.id, ebl.platformId),
    // });
    // if (!platform) return false;

    // const activeUsers = await ctx.db.select().from(Users).where(eq(Users.activePlatformId, platform.id));
    // const receivers = activeUsers?.filter((u) => u.email)?.map((u) => ({ address: u.email!, name: u.name ?? "" }));
    // const html = render(
    //   PaymentMadeNotification({
    //     logoUrl: "cid:bxlogo",
    //     companyName: "props.companyName",
    //     sender: "props.sender",
    //     eBlNo: input.eBlId,
    //     note: "",
    //     viewEblLink: `props.url`,
    //   }),
    // );

    // await ctx.emailService.send({
    //   to: receivers,
    //   subject: "SSS Consignee has sent a payment to you",
    //   html,
    //   attachments: [
    //     {
    //       path: "./public/bxwlogo.png",
    //       contentType: "image/png",
    //       cid: "bxlogo",
    //     },
    //   ],
    // });

    return true;
  }),

  removeAll: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.transaction(async (tx) => {
      await tx.delete(PaymentRequestDocs).where(ne(PaymentRequestDocs.paymentRequestId, 0n));
      await tx.delete(PaymentRequests).where(ne(PaymentRequests.id, 0n));
    });

    return true;
  }),
});
