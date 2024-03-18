import { type EmailServiceType, type SendEmailProps } from "@/server/services/email-service";

type WatcherType = Array<SendEmailProps>;

export const useTestEmailService = () => {
  const watcher: WatcherType = [];
  const emailService: EmailServiceType = {
    send: async (props: SendEmailProps) => {
      watcher.push(props)
      return "messageId"
    }
  };

  return {
    emailService,
    watcher,
  };
};
