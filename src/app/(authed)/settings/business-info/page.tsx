"use server";

import BusinessInfoSection from "@/app/_components/settings/business-info-section";
import MainSection from "@/app/_components/settings/main-section";
import { getServerAuthSession } from "@/server/auth";
import { BusinessInfoSchema } from "@/types/business-info";

export default async function Page() {
  const session = await getServerAuthSession();
  const info = BusinessInfoSchema.safeParse(session?.platform.businessInfo);

  return (
    <MainSection tabIndex={1}>
      <BusinessInfoSection info={info.success ? info.data : undefined} />
    </MainSection>
  );
}
