import { type components } from "@/types/bu-scheme";

export const transferredEBlRecord: components["schemas"]["BillOfLadingRecord"] =
  {
    allow_actions: [],
    bl: {
      id: "d571ec58-2a50-4708-9eeb-43e276f08065",
      version: 6,
      events: [
        {
          bill_of_lading: {
            bill_of_lading: {
              transportDocumentReference: "BL-001",
              carrierCode: "",
              carrierCodeListProvider: "SMDG",
              issuingParty: {
                partyName: "Open EBL",
                partyContactDetails: [],
                identifyingCodes: [
                  {
                    DCSAResponsibleAgencyCode: "DID",
                    partyCode:
                      "did:openebl:3993ace7-eb6c-4a1f-bed8-121643a278c9",
                  },
                ],
              },
              shipmentLocations: [
                {
                  location: {
                    locationName: "Taipei",
                    // address: null,
                    UNLocationCode: "TW TPE",
                    facilityCode: "",
                    // facilityCodeListProvider: "",
                  },
                  shipmentLocationTypeCode: "POL",
                },
                {
                  location: {
                    locationName: "Los Angeles",
                    // address: null,
                    UNLocationCode: "US LAX",
                    facilityCode: "",
                    // facilityCodeListProvider: "",
                  },
                  shipmentLocationTypeCode: "POD",
                  eventDateTime: "0001-01-01T00:00:00Z",
                },
              ],
              shippingInstruction: {
                shippingInstructionReference: "",
                shippingInstructionCreatedDateTime: "",
                shippingInstructionUpdatedDateTime: "",
                isShippedOnBoardType: false,
                isElectronic: false,
                isToOrder:false,
                documentStatus: "ISSU",
                // transportDocumentTypeCode: "",
                consignmentItems: [],
                utilizedTransportEquipments: [],
                documentParties: [
                  {
                    party: {
                      partyContactDetails: [],
                      partyName: "Open EBL",
                      identifyingCodes: [
                        {
                          DCSAResponsibleAgencyCode: "DID",
                          partyCode:
                            "did:openebl:3993ace7-eb6c-4a1f-bed8-121643a278c9",
                        },
                      ],
                    },
                    partyFunction: "DDR",
                    isToBeNotified: false,
                  },
                  {
                    party: {
                      partyContactDetails: [],
                      partyName: "Open EBL",
                      identifyingCodes: [
                        {
                          DCSAResponsibleAgencyCode: "DID",
                          partyCode:
                            "did:openebl:d2856f4e-e636-4cf0-9110-fbb45304e614",
                        },
                      ],
                    },
                    partyFunction: "OS",
                    isToBeNotified: false,
                  },
                  {
                    party: {
                      partyContactDetails: [],
                      partyName: "Open EBL",
                      identifyingCodes: [
                        {
                          DCSAResponsibleAgencyCode: "DID",
                          partyCode:
                            "did:openebl:0158341d-5c6b-4121-bfe4-535c7606bbd5",
                        },
                      ],
                    },
                    partyFunction: "CN",
                    isToBeNotified: false,
                  },
                  {
                    party: {
                      partyContactDetails: [],
                      partyName: "Open EBL",
                      identifyingCodes: [
                        {
                          DCSAResponsibleAgencyCode: "DID",
                          partyCode:
                            "did:openebl:66c71465-3d0b-43d8-9e1b-c88c7a7634ca",
                        },
                      ],
                    },
                    partyFunction: "DDS",
                    isToBeNotified: false,
                  },
                ],
              },
            },
            file: {
              name: "filename.pdf",
            },
            doc_type: "MasterBillOfLading",
            created_by: "did:openebl:3993ace7-eb6c-4a1f-bed8-121643a278c9",
            created_at: "2024-03-13T02:51:49Z",
            note: "issued by XXX",
          },
        },
        {
          transfer: {
            transfer_by: "did:openebl:3993ace7-eb6c-4a1f-bed8-121643a278c9",
            transfer_to: "did:openebl:d2856f4e-e636-4cf0-9110-fbb45304e614",
            transfer_at: "2024-03-13T02:51:49Z",
            note: "transferred by XXX",
          },
        },
      ],
      current_owner: "did:openebl:d2856f4e-e636-4cf0-9110-fbb45304e614",
    },
  };
