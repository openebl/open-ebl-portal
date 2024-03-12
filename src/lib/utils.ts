import { clsx, type ClassValue } from "clsx";
import crypto from "crypto";
import { twMerge } from "tailwind-merge";
import type { Platforms } from "@/types/platform";
import { type EBlRecordType } from "@/types/ebl";

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

export const getLatestBillOfLading = (record: EBlRecordType) => {
  try {
    // Reverse the events array to start searching from the end
    const reversedEvents = [...record.events].reverse();

    // Find the last event that has a bill_of_lading property
    const latestEventWithBillOfLading = reversedEvents.find(event => event.bill_of_lading !== undefined);

    // If such an event is found, return the bill_of_lading object
    if (latestEventWithBillOfLading) {
      return latestEventWithBillOfLading.bill_of_lading;
    }

    // If no event with a bill_of_lading is found, throw an error
    throw new Error('No bill_of_lading object found in events');
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function platformsToDropdownOptionList(platforms: Platforms | null | undefined) {
  if (!platforms) return [];
  return Object.entries(platforms).map(([id, platform]) => ({
    label: platform.name,
    value: id,
  }));
}
