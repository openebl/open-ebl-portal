import type {
  PutObjectProps,
  StorageServiceType,
} from "@/server/services/storage-service";

type WatcherType = Record<string, { content: Buffer; contentType: string }>;

export const useTestStorageService = () => {
  const watcher: WatcherType = {};
  const storageService: StorageServiceType = {
    putObject: async ({ content, key, contentType }: PutObjectProps) => {
      watcher[key] = { content, contentType };
    },
    getPresignedUrl: async ({key}:{key:string}) => {
      return `https://storage.com/${key}`
    }
  };

  return {
    storageService,
    watcher,
  };
};
