import { Notification } from "../types";
import { snsClient } from "../config/sns.config";
import { PublishCommand } from "@aws-sdk/client-sns";

class Service {
  async sendNotification(data: Notification) {
    try {
      const timestamp = new Date().toISOString();

      const command = new PublishCommand({
        TopicArn: process.env.SNS_ARN!,
        Message: JSON.stringify(data),
        MessageAttributes: {
          channels: {
            DataType: "String.Array",
            StringValue: JSON.stringify(data.channels),
          },
          publishedAt: {
            DataType: "String",
            StringValue: timestamp,
          },
        },
      });

      await snsClient.send(command);
      console.log("Message published to SNS!");
    } catch (error) {
      console.error("Failed to publish message to SNS", error);
      throw error;
    }
  }
}

export default Service;
