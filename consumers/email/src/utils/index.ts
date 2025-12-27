import { SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { EMAIL_DATA, OTP_DATA } from "../types";
import { EMAIL_SUBJECT_MAP, SES_EMAIL, TEMPLATE_DIR } from "../constants";
import fs from "fs";
import path from "path";
import { sesClient } from "../config/ses.config";

export const sendEmail = async (reciever: string, data: EMAIL_DATA) => {
  const { template, variables } = data;
  if (!EMAIL_SUBJECT_MAP[template]) {
    throw new Error(`Unknown email template: ${template}`);
  }
  const subject = EMAIL_SUBJECT_MAP[template];
  const html = renderTemplate(template, variables);
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

function renderTemplate(
  templateName: string,
  variables: Record<string, string | number> | OTP_DATA
): string {
  const templatePath = path.join(TEMPLATE_DIR, `${templateName}.html`);

  let html = fs.readFileSync(templatePath, "utf-8");

  for (const [key, value] of Object.entries(variables)) {
    html = html.replaceAll(`{{${key}}}`, String(value));
  }

  return html;
}
