import { type components } from "@/types/bu-scheme";

export const printedEBlRecord: components["schemas"]["BillOfLadingRecord"] = {
  allow_actions: [],
  bl: {
    id: "d571ec58-2a50-4708-9eeb-43e276f08065",
    version: 6,
    events: [
      {
        bill_of_lading: {
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
        },
      },
      {
        print_to_paper: {
          print_by: "did:openebl:d2856f4e-e636-4cf0-9110-fbb45304e614",
          print_at: "2024-03-13T12:51:49Z",
          note: "printed by XXX",
        },
      },
    ],
    current_owner: "did:openebl:d2856f4e-e636-4cf0-9110-fbb45304e614",
  },
};
