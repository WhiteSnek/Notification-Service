import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.BUCKET_NAME || "";

const getTemplate = async(templateName: string, service: string) => {
    const key = `templates/${service}/${templateName}.html`;

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

const getTemplateMetadata = async() => {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: "templates/metadata.json"
    });

    const response = await s3Client.send(command);
    if (!response.Body) {
        throw new Error(`Metadata not found in bucket ${BUCKET_NAME}`);
    }
    const metadata = await response.Body.transformToString();
    return JSON.parse(metadata);
}

export { getTemplate, getTemplateMetadata };