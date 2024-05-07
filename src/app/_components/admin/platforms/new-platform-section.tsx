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
import { newBusinessInfo } from "@/types/business-info";

const NewPlatformSection = () => {
  const router = useRouter();
  // all form field value can't be undefined to avoid controlled/uncontrolled component error
  // More info: https://react.dev/reference/react-dom/components/textarea#im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled
  const form = useForm<PlatformFormType>({
    resolver: zodResolver(PlatformFormSchema),
    defaultValues: { name: "", platformId: "", ...newBusinessInfo },
  });
  const mutation = api.adminPlatform.create.useMutation({
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to create platform: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Platform is created successfully");
      router.push("/admin/platforms", { scroll: true });
      router.refresh();
    },
  });
  const loading = mutation.isLoading;
  const onSubmit = form.handleSubmit(async (values) => {
    mutation.mutate(values);
  });

  return (
    <EditPlatformPanel
      title="New Platform"
      form={form}
      canUpdateInfo={!loading}
      onSubmit={onSubmit}
    >
      {/* Action Panel */}
      <div className="flex h-[5.25rem] w-full items-center justify-end border-t-[1px] border-[#D9D9D9] px-[1.875rem]">
        <div className="flex gap-4">
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
            Create
          </Button>
        </div>
      </div>
    </EditPlatformPanel>
  );
};
export default NewPlatformSection;
