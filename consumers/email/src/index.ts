import { SQSEvent, SQSBatchResponse, SQSBatchItemFailure } from "aws-lambda";
import dotenv from "dotenv";
import { EVENT_TO_EMAIL_TEMPLATE } from "./constants";
import { sendEmail } from "./utils";
import { Notification } from "./types";

dotenv.config();

export const handler = async (
  event: SQSEvent
): Promise<SQSBatchResponse> => {
  const batchItemFailures: SQSBatchItemFailure[] = [];

  for (const record of event.Records) {
    try {
      const data: Notification = JSON.parse(record.body);

      const template = EVENT_TO_EMAIL_TEMPLATE[data.eventType];

      await sendEmail(
        template,
        data.reciever,
        data.data
      );
    } catch (error) {
      console.error(
        `Failed to process message ${record.messageId}:`,
        error
      );

      batchItemFailures.push({
        itemIdentifier: record.messageId,
      });
    }
  }

  return {
    batchItemFailures,
  };
};