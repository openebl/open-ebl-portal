import { clsx, type ClassValue } from "clsx";
import crypto from "crypto";
import { twMerge } from "tailwind-merge";

import { type BusinessInfoType } from "@/types/business-info";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomId(len = 20): string {
  const isNode = process?.versions?.node != null;

  if (isNode) {
    // hack to get crypto.getRandomValues working in node.
    // eslint-disable-next-line
    const arr = require("crypto").randomBytes(len) as Buffer;
    return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join("");
  } else {
    const arr = new Uint8Array(len / 2);
    crypto.getRandomValues(arr);
    return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join("");
  }
}

type BuType = BusinessInfoType & { id: string };
export const buListToDropdownOptionList = (buList: BuType[] | null | undefined) => {
  if (!buList) return [];
  return Object.entries(buList).map(([id, bu]) => ({
    label: bu.legalBusinessName ?? '',
    value: id,
  }));
}
