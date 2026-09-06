import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({});

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

export { getTemplate }