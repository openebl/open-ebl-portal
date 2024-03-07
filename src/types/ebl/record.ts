import { z } from "zod";
import { EBlDocTypeSchema, EBlAllowActionTypeSchema, BusinessUnitID, Base64EncodedString, NullableString, MaybeString, Timestamp } from "./common";

const identifyingCodesSchema = z.object({
  DCSAResponsibleAgencyCode: z.string(),
  partyCode: BusinessUnitID,
});

const partySchema = z.object({
  partyContactDetails: z.array(
    z.object({
      name: NullableString,
      phone: NullableString,
      email: NullableString,
      url: NullableString,
    })
  ).nullable(),
  identifyingCodes: z.array(identifyingCodesSchema),
});

const documentPartiesSchema = z.array(
  z.object({
    party: partySchema,
    partyFunction: z.string(),
    isToBeNotified: z.boolean(),
  })
);

const locationSchema = z.object({
  locationName: z.string(),
  address: NullableString,
  UNLocationCode: z.string(),
  facilityCode: z.string(),
  facilityCodeListProvider: z.string(),
});

const shipmentLocationsSchema = z.array(
  z.object({
    location: locationSchema,
    shipmentLocationTypeCode: z.string(),
    eventDateTime: Timestamp.optional(), // TODO: to be deleted
  })
);

export const EBlRecordSchema = z.object({
  id: z.string(),
  version: z.number(),
  parent_hash: z.string(), // doc previous version SHA512 hash string
  current_owner: BusinessUnitID,
  events: z.array(
    z.object({
      bill_of_lading: z.object({ // issue or draft eBL event
        bill_of_lading: z.object({ // eBL detail
          transportDocumentReference: z.string(),
          carrierCode: z.string(),
          carrierCodeListProvider: z.string(),
          issuingParty: partySchema,
          shipmentLocations: shipmentLocationsSchema,
          shippingInstruction: z.object({
            shippingInstructionReference: z.string(),
            documentStatus: z.string(),
            transportDocumentTypeCode: z.string(),
            isToOrder: z.boolean(),
            consignmentItems: z.any(), // TODO
            utilizedTransportEquipments: z.any(), // TODO
            documentParties: documentPartiesSchema,
          }),
        }),
        file: z.object({
          name: z.string(),
          file_type: z.string(),
          content: Base64EncodedString.nullable(),
          created_date: Timestamp,
        }),
        doc_type: EBlDocTypeSchema,
        created_by: BusinessUnitID,
        created_at: Timestamp,
        note: MaybeString,
      }).optional(),
      transfer: z.object({ // transfer eBL event
        transfer_by: BusinessUnitID,
        transfer_to: BusinessUnitID,
        transfer_at: Timestamp,
        note: MaybeString,
      }).optional(),
      return: z.object({ // return eBL event
        return_by: BusinessUnitID,
        return_to: BusinessUnitID,
        return_at: Timestamp,
        note: MaybeString,
      }).optional(),
      surrender: z.object({ // surrender eBL event
        surrender_by: BusinessUnitID,
        surrender_to: BusinessUnitID,
        surrender_at: Timestamp,
        note: MaybeString,
      }).optional(),
      amendment_request: z.object({ // amend eBL event
        request_by: BusinessUnitID,
        request_to: BusinessUnitID,
        request_at: Timestamp,
        note: MaybeString,
      }).optional(),
      print_to_paper: z.object({ // print eBL event
        print_by: BusinessUnitID,
        print_at: Timestamp,
        note: MaybeString,
      }).optional(),
      accomplish: z.object({ // accomplish eBL event
        accomplish_by: BusinessUnitID,
        accomplish_at: Timestamp,
        note: MaybeString,
      }).optional(),
    })
  ),
});

export const EBlRecordListSchema = z.object({
  total: z.number(),
  records: z.array(EBlRecordSchema),
})

export const EBlRecordDetailSchema = z.object({
  allowed_actions: z.array(EBlAllowActionTypeSchema),
  record: EBlRecordSchema,
})

