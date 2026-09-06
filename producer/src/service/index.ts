import { Notification, Template } from "../types";
import { snsClient } from "../config/sns.config";
import { PublishCommand } from "@aws-sdk/client-sns";
import {
  getMetadata,
  saveMetadata,
  getUploadPresignedUrl,
} from "../utils/bucket";

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

  async addTemplate(data: Template) {
    try {
      const { subject, eventName,clientId, channel } = data;

      const metadata = await getMetadata(channel, clientId);

      metadata[eventName] = {
        subject,
      };

      await saveMetadata(channel, clientId, metadata);

      const templateKey = `templates/${channel}/${clientId}/${eventName}.html`;

      const presignedUrl = await getUploadPresignedUrl(
        templateKey,
        "text/html",
      );
      return {
        eventName,
        channel,
        subject,
        key: templateKey,
        presignedUrl,
      };
    } catch (error) {
      console.error("Failed to add template", error);
      throw error;
    }
  }
}

export default Service;
