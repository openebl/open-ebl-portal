import { type DocExtractionType } from "@/add-ons/doc-reader/types";
import { EBlDocType } from "@/types/ebl/common";

export const useTestDocExtraction = () => {
  const docExtraction: DocExtractionType = {
    createExtraction: (_args: {
      uuid: string;
      filename: string;
      content: Buffer;
    }) => {
      return Promise.resolve();
    },

    getExtraction: (uuid: string) => {
      return Promise.resolve({
        file: {
          name: 'bill_of_lading.pdf',
          type: 'bill_of_lading.',
          content: '',
        },
        bl_number: uuid,
        bl_doc_type: EBlDocType.HouseBillOfLading,
        to_order: false,
        pol: {
          locationName: 'YanTain',
          UNLocationCode: 'CNYTN',
        },
        pod: {
          locationName: 'Los Angeles',
          UNLocationCode: 'CNLAX',
        },
        shipper: 'did:21473983271',
        consignee: 'did:21473983271',
        release_agent: 'did:21473983271',
        note: '',
        draft: true,
      });
    },
  };

  return {
    docExtraction,
  };
};
