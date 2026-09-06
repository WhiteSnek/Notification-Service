import { SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { EMAIL_DATA, EmailTemplate, OTP_DATA } from "../types";
import { EMAIL_SUBJECT_MAP, SES_EMAIL, TEMPLATE_DIR } from "../constants";
import fs from "fs";
import path from "path";
import { getTemplate } from "./bucket";
import { sesClient } from "../config/ses.config";

export const sendEmail = async (template: EmailTemplate, clientId: string, reciever: string, data: EMAIL_DATA) => {
  const { variables } = data;
  if (!EMAIL_SUBJECT_MAP[template]) {
    throw new Error(`Unknown email template: ${template}`);
  }
  const subject = EMAIL_SUBJECT_MAP[template];
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
