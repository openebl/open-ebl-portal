import { appRouter } from "@/server/api/root";
import {
  type TestDbType
} from "@/test/integration/fixtures/db-fixtures";
import { useTestDocExtraction } from "@/test/integration/helpers/test-doc-extraction";
import { useTestStorageService } from "@/test/integration/helpers/test-storage";
import { type Session } from "next-auth";

const useCaller = ({
  db,
  session,
}: {
  db: TestDbType;
  session: Session | null;
}) => {
  const { storageService, watcher } = useTestStorageService();
  const { docExtraction } = useTestDocExtraction();
  const caller = appRouter.createCaller({
    headers: new Headers(),
    session,
    db,
    storageService,
    docExtraction,
  });
  return { caller, session, db, storageService, storageWatch: watcher };
};

export { useCaller };

