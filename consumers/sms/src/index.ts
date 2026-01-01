import { DeleteMessageCommand, ReceiveMessageCommand } from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
import { EVENT_TO_SMS_TEMPLATE, QUEUE_URL } from "./constants"
import { sqsClient } from "./config/sqs.config";
import { Notification } from "./types";
import { sendSMS } from "./utils";

dotenv.config();

async function init() {
  const command = new ReceiveMessageCommand({
    QueueUrl: QUEUE_URL,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20,
  });
  while (true) {
    const { Messages } = await sqsClient.send(command);
    if (!Messages) {
      continue;
    }
    try {
        for(const message of Messages){
            const {Body} = message;
            if (!Body) continue;
            const data: Notification = JSON.parse(Body)
            sendSMS(data.eventType, data.reciever, data.data)
            await sqsClient.send(new DeleteMessageCommand({
              QueueUrl: QUEUE_URL,
              ReceiptHandle: message.ReceiptHandle
            }))
        }
    } catch (error) {
        console.log(error)
    }
  }
}

init()
