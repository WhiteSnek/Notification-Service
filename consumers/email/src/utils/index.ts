import { SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { EMAIL_DATA, EmailTemplate, OTP_DATA } from "../types";
import { SES_EMAIL } from "../constants";
import { getTemplate, getTemplateMetadata } from "./bucket";
import { sesClient } from "../config/ses.config";

export const sendEmail = async (eventType: string, clientId: string, reciever: string, data: EMAIL_DATA) => {
  const { variables } = data;
  const template = eventType.toLowerCase() as EmailTemplate;
  const metadata = await getTemplateMetadata(clientId);
  if (!metadata[template]) {
    throw new Error(`Unknown email template: ${template}`);
  }
  const subject = metadata[template].subject;
  const html = await renderTemplate(template, clientId, variables);
  const params: SendEmailCommandInput = {
    Source: SES_EMAIL,
    Destination: {
      ToAddresses: [reciever],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
            Data: html,
            Charset: "UTF-8",
        }
      },
    },
  };
  await sesClient.send(new SendEmailCommand(params))
};

async function renderTemplate(
  templateName: string,
  clientId: string,
  variables: Record<string, string | number> | OTP_DATA
): Promise<string> {
  const body = await getTemplate(templateName, clientId);

  let html = await body.transformToString();

  for (const [key, value] of Object.entries(variables)) {
    html = html.replaceAll(`{{${key}}}`, String(value));
  }

  return html;
}
