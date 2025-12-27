import { DeleteMessageCommand, ReceiveMessageCommand } from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
import { QUEUE_URL } from "./constants";
import { sqsClient } from "./config/sqs.config";
import { sendEmail } from "./utils";

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
            const data = JSON.parse(Body)
            await sendEmail(data.reciever, data.data)
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
