import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { EmailMetadata } from "../types";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.BUCKET_NAME || "";

const getTemplate = async(templateName: string, service: string) => {
    const key = `templates/email/${service}/${templateName}.html`;

    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
        throw new Error(`Template ${templateName} not found in bucket ${BUCKET_NAME}`);
    }
    return response.Body;
}

const getTemplateMetadata = async(service: string): Promise<EmailMetadata> => {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `templates/email/${service}/metadata.json`
    });

    const response = await s3Client.send(command);
    if (!response.Body) {
        throw new Error(`Metadata not found in bucket ${BUCKET_NAME}`);
    }
    const metadata = await response.Body.transformToString();
    return JSON.parse(metadata);
}

export { getTemplate, getTemplateMetadata };