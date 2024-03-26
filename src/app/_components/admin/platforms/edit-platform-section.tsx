"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import {
  PlatformFormSchema,
  type PlatformFormType,
} from "@/types/admin-platform";
import EditPlatformPanel from "./edit-platform-panel";
import { type Platform } from "@prisma/client";
import { hasPermission, type PermissionType } from "@/server/permissions";
import PermissionedSection from "@/app/_components/common/permissioned-section";
import { BusinessInfoSchema } from "@/types/business-info";

const EditPlatformSection = ({
  platform,
  permissions,
}: {
  platform: Platform;
  permissions?: PermissionType[];
}) => {
  const router = useRouter();
  const form = useForm<PlatformFormType>({
    resolver: zodResolver(PlatformFormSchema),
    defaultValues: {
      name: platform.name,
      platformId: platform.platformId ?? undefined,
      ...(platform.businessInfo && BusinessInfoSchema.parse(platform.businessInfo)),
    },
  });

  const mutation = api.adminPlatform.update.useMutation({
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to update platform: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Platform updated successfully");
      router.push("/admin/platforms", { scroll: true });
      router.refresh();
    },
  });

  const loading = mutation.isLoading;

  const onSubmit = form.handleSubmit(async (values) => {
    mutation.mutate({ ...values, id: platform.id });
  });

  return (
    <EditPlatformPanel
      title="Update Platform"
      form={form}
      canUpdateInfo={hasPermission("write:admin/platforms", permissions) && !loading}
      onSubmit={onSubmit}
    >
      {/* Action Panel */}
      <div className="flex h-[5.25rem] w-full items-center justify-between border-t-[1px] border-[#D9D9D9] px-[1.875rem]">
        <Link href={`/admin/platforms/${platform.id}/users`}>
          Manage Users
        </Link>

        <div className="flex gap-4">
          <PermissionedSection
            permissions={permissions}
            required="write:admin/platforms"
            alternative={
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-[11.25rem]"
                type="button"
              >
                <Link href="/admin/platforms">Close</Link>
              </Button>
            }
          >
            <Link href="/admin/platforms" tabIndex={-1}>
            <Button
              variant="outline"
              size="lg"
              className="w-[11.25rem]"
              type="button"
              loading={loading}

            >
              Cancel
            </Button>
            </Link>
            <Button
              size="lg"
              className="w-[11.25rem]"
              type="submit"
              loading={loading}
            >
              Update
            </Button>
          </PermissionedSection>
        </div>
      </div>
    </EditPlatformPanel>
  );
};
export default EditPlatformSection;
