import { type AgreementManifestServiceType } from "@/server/services/agreement-manifest-service";

export const useTestAgreementManifestService = () => {
  const agreementManifest: AgreementManifestServiceType = {
    get: async () => {
      return [
        {
          service: "bluex_ebl",
          name: "tos",
          version: 20240721,
          url: "/tos",
        },
        {
          service: "bluex_ebl",
          name: "privacy",
          version: 20240722,
          url: "/privacy",
        },
      ];
    },
  };

  return { agreementManifest };
};
