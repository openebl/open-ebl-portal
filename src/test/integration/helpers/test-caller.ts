import { appRouter } from "@/server/api/root";
import { type TestDbType } from "@/test/integration/fixtures/db-fixtures";
import { useTestDocExtraction } from "@/test/integration/helpers/test-doc-extraction";
import { useTestStorageService } from "@/test/integration/helpers/test-storage";
import { useTestEmailService } from "./test-email";
import { type Session } from "next-auth";

const useCaller = ({
  db,
  session,
}: {
  db: TestDbType;
  session: Session | null;
}) => {
  const { emailService, watcher: emailWatcher } = useTestEmailService();
  const { storageService, watcher: storageWatch } = useTestStorageService();
  const { docExtraction } = useTestDocExtraction();
  const caller = appRouter.createCaller({
    headers: new Headers(),
    session,
    db,
    emailService,
    storageService,
    docExtraction,
  });
  return { caller, session, db, storageService, storageWatch, emailWatcher };
};

export { useCaller };
