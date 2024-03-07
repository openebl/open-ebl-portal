import { type EBlRecordType } from "@/types/ebl";
import { mkdtemp } from "fs";
import os from "os";
import path from "path";

export const tempFolder: () => Promise<string> = () => {
  return new Promise<string>((resolve, reject) => {
    mkdtemp(path.join(`${os.tmpdir()}${path.sep}`), (err, directory) => {
      if (err) {
        reject(err);
      } else {
        resolve(directory);
      }
    });
  });
};

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
