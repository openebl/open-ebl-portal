import type {
  StorageServiceType,
  PutObjectProps,
} from "@/server/services/storage-service";
import { Effect } from "effect";

type WatcherType = Record<string, { content: Buffer; contentType: string }>;

export const useTestStorageService = () => {
  const watcher: WatcherType = {};
  const storageService: StorageServiceType = {
    putObject: ({ content, key, contentType }: PutObjectProps) => {
      watcher[key] = { content, contentType };
      return Effect.succeedNone;
    },
    getPresignedUrl: ({key}:{key:string}) => {
      return Effect.succeed(`https://storage.com/${key}`)
    }
  };

  return {
    storageService,
    watcher,
  };
};
