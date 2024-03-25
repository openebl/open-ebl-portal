"use client";

import { useRouter } from "next/navigation";

const RevalidateRedirect = ({path}: {path?: string}) => {
  const router = useRouter();
  router.push(path ?? '/')
  router.refresh();

  return null;
}

export default RevalidateRedirect;
