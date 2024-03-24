import { type PermissionType } from "@/server/permissions";

type PermissionedSectionProps = {
  permissions?: PermissionType[];
  required: PermissionType;
  children: React.ReactNode;
  alternative?: React.ReactNode;
};

const PermissionedSection = ({
  permissions,
  required,
  children,
  alternative,
}: PermissionedSectionProps) => {
  return permissions?.includes(required) ? children : (alternative ?? null);
};

export default PermissionedSection;
