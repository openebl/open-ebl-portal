import { relations } from "drizzle-orm";
import {
  bigint,
  bigserial,
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const _prisma_migrations = pgTable("_prisma_migrations", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  checksum: varchar("checksum", { length: 64 }).notNull(),
  finished_at: timestamp("finished_at", { withTimezone: true, mode: "string" }),
  migration_name: varchar("migration_name", { length: 255 }).notNull(),
  logs: text("logs"),
  rolled_back_at: timestamp("rolled_back_at", {
    withTimezone: true,
    mode: "string",
  }),
  started_at: timestamp("started_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  applied_steps_count: integer("applied_steps_count").default(0).notNull(),
});

export const VerificationTokens = pgTable(
  "VerificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { precision: 3 }).notNull(),
  },
  (table) => {
    return {
      identifier_token_key: uniqueIndex("VerificationToken_identifier_token_key").using(
        "btree",
        table.identifier,
        table.token,
      ),
      token_key: uniqueIndex("VerificationToken_token_key").using("btree", table.token),
    };
  },
);

export const Users = pgTable(
  "User",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
    name: text("name"),
    email: text("email"),
    emailVerified: timestamp("emailVerified", { precision: 3 }),
    image: text("image"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    activePlatformId: bigint("activePlatformId", { mode: "bigint" })
      .notNull()
      .references(() => Platforms.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).defaultNow().notNull(),
  },
  (table) => {
    return {
      email_key: uniqueIndex("User_email_key").using("btree", table.email),
    };
  },
);

export const Accounts = pgTable(
  "Account",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("userId", { mode: "bigint" })
      .notNull()
      .references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      provider_providerAccountId_key: uniqueIndex("Account_provider_providerAccountId_key").using(
        "btree",
        table.provider,
        table.providerAccountId,
      ),
    };
  },
);

export const Sessions = pgTable(
  "Session",
  {
    id: text("id").primaryKey().notNull(),
    sessionToken: text("sessionToken").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("userId", { mode: "bigint" })
      .notNull()
      .references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    expires: timestamp("expires", { precision: 3 }).notNull(),
  },
  (table) => {
    return {
      sessionToken_key: uniqueIndex("Session_sessionToken_key").using("btree", table.sessionToken),
    };
  },
);

export const UserRoles = pgTable(
  "UserRole",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("userId", { mode: "bigint" })
      .notNull()
      .references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    platformId: bigint("platformId", { mode: "bigint" })
      .notNull()
      .references(() => Platforms.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    role: text("role").notNull(),
    createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
  },
  (table) => {
    return {
      userId_platformId_role_key: uniqueIndex("UserRole_userId_platformId_role_key").using(
        "btree",
        table.userId,
        table.platformId,
        table.role,
      ),
    };
  },
);

export const Platforms = pgTable(
  "Platform",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).defaultNow().notNull(),
    platformId: text("platformId"),
    admin: boolean("admin").default(false).notNull(),
    businessInfo: jsonb("businessInfo").$type<Record<string, unknown>>(),
  },
  (table) => {
    return {
      platformId_key: uniqueIndex("Platform_platformId_key").using("btree", table.platformId),
    };
  },
);

export const DocImages = pgTable("DocImage", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  docFileId: bigint("docFileId", { mode: "bigint" }).references(() => DocFiles.id, {
    onDelete: "restrict",
    onUpdate: "cascade",
  }),
  page: integer("page").notNull(),
  thumbnail: boolean("thumbnail").default(false).notNull(),
  storagekey: text("storagekey"),
  createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3 }).defaultNow().notNull(),
});

export const DocFiles = pgTable(
  "DocFile",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    platformId: bigint("platformId", { mode: "bigint" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    uploaderId: bigint("uploaderId", { mode: "bigint" })
      .notNull()
      .references(() => Users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    filename: text("filename"),
    storagekey: text("storagekey"),
    createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).defaultNow().notNull(),
    uuid: text("uuid"),
  },
  (table) => {
    return {
      uuid_key: uniqueIndex("DocFile_uuid_key").using("btree", table.uuid),
    };
  },
);

export const EBlStashes = pgTable("EBlStash", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  platformId: bigint("platformId", { mode: "bigint" }).notNull(),
  eBlId: text("eBlId").notNull(),
  status: text("status").notNull(),
  currentOwner: text("currentOwner").notNull(),
  createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
  version: integer("version").notNull(),
});

export const EBlNotifications = pgTable("EBlNotification", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  eBlStashId: bigint("eBlStashId", { mode: "bigint" }).notNull(),
  createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
  name: text("name").notNull(),
});

export const Requesters = pgTable("Requester", {
  id: text("id").primaryKey().notNull(),
  session: text("session"),
  platformId: bigint("platformId", { mode: "bigint" }),
  userId: bigint("userId", { mode: "bigint" }),
  ip: text("ip"),
  userAgent: text("userAgent"),
  acceptLanguage: text("acceptLanguage"),
  createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
});

export const UserAgreements = pgTable(
  "UserAgreement",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
    userId: bigint("userId", { mode: "bigint" }).references(() => Users.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
    platformId: bigint("platformId", { mode: "bigint" }),
    requesterId: text("requesterId").notNull(),
    service: text("service").notNull(),
    name: text("name").notNull(),
    version: integer("version"),
    acceptedAt: timestamp("acceptedAt", { precision: 3 }),
    createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
  },
  (table) => {
    return {
      uuid_key: uniqueIndex("UserAgreement_user_service_name_key").using(
        "btree",
        table.userId,
        table.service,
        table.name,
        table.version,
      ),
    };
  },
);

export const PaymentRequestStatusEnum = pgEnum("PaymentRequestStatus", [
  "REQUESTED",
  "PAID",
  "CONFIRMED",
  "REJECTED",
  "CANCELLED",
  "EXPIRED",
]);

export const PaymentRequests = pgTable("PaymentRequest", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
  eBlId: text("eBlId").notNull(),
  status: PaymentRequestStatusEnum("status").default("REQUESTED").notNull(),
  requestPlatformId: bigint("requestPlatformId", { mode: "bigint" }),
  requestUserId: bigint("requestUserId", { mode: "bigint" }),
  requesterBusinessUnitId: text("requesterBusinessUnitId").notNull(),
  payerBusinessUnitId: text("payerBusinessUnitId").notNull(),
  invoiceAmount: numeric("invoiceAmount", { precision: 24, scale: 4 }).notNull(),
  message: text("message").notNull(),

  createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
});

export const PaymentRequestDocs = pgTable("PaymentRequestDoc", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
  paymentRequestId: bigint("paymentRequestId", { mode: "bigint" }).references(() => PaymentRequests.id, {
    onDelete: "restrict",
    onUpdate: "cascade",
  }),
  fileName: text("fileName").notNull(),
  docId: text("docId"),
  docType: text("docType").notNull(),
});

export const DocExtractions = pgTable("DocExtraction", {
  id: text("id").primaryKey().notNull(),
  status: text("status"),
  createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3 }).defaultNow().notNull(),
  result: jsonb("result").$type<Record<string, unknown>>(),
  error: text("error"),
});

//---------------------------------------------------------------------
// Relations
//---------------------------------------------------------------------
export const UserRelations = relations(Users, ({ one, many }) => ({
  Platform: one(Platforms, {
    fields: [Users.activePlatformId],
    references: [Platforms.id],
  }),
  Accounts: many(Accounts),
  Sessions: many(Sessions),
  UserRoles: many(UserRoles),
  DocFiles: many(DocFiles),
}));

export const PlatformRelations = relations(Platforms, ({ many }) => ({
  Users: many(Users),
  UserRoles: many(UserRoles),
}));

export const AccountRelations = relations(Accounts, ({ one }) => ({
  User: one(Users, {
    fields: [Accounts.userId],
    references: [Users.id],
  }),
}));

export const SessionRelations = relations(Sessions, ({ one }) => ({
  User: one(Users, {
    fields: [Sessions.userId],
    references: [Users.id],
  }),
}));

export const UserRoleRelations = relations(UserRoles, ({ one }) => ({
  User: one(Users, {
    fields: [UserRoles.userId],
    references: [Users.id],
  }),
  Platform: one(Platforms, {
    fields: [UserRoles.platformId],
    references: [Platforms.id],
  }),
}));

export const DocImageRelations = relations(DocImages, ({ one }) => ({
  DocFile: one(DocFiles, {
    fields: [DocImages.docFileId],
    references: [DocFiles.id],
  }),
}));

export const DocFileRelations = relations(DocFiles, ({ one, many }) => ({
  DocImages: many(DocImages),
  User: one(Users, {
    fields: [DocFiles.uploaderId],
    references: [Users.id],
  }),
}));

export const PaymentRequestRelations = relations(PaymentRequests, ({ one, many }) => ({
  RequestUser: one(Users, {
    fields: [PaymentRequests.requestUserId],
    references: [Users.id],
  }),
  RequestPlatform: one(Platforms, {
    fields: [PaymentRequests.requestPlatformId],
    references: [Platforms.id],
  }),
  PaymentRequestDocs: many(PaymentRequestDocs),
}));

export const PaymentRequestDocRelations = relations(PaymentRequestDocs, ({ one }) => ({
  PaymentRequest: one(PaymentRequests, {
    fields: [PaymentRequestDocs.paymentRequestId],
    references: [PaymentRequests.id],
  }),
}));
