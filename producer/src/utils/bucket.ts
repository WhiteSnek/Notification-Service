import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.BUCKET_NAME || "";

export const getUploadPresignedUrl = async (
  key: string,
  contentType: string
) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });
};

export const getMetadata = async (
  channel: string,
  service: string
) => {
  const key = `templates/${channel}/${service}/metadata.json`;
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    const response = await s3Client.send(command);
    if (!response.Body) {
      return {};
    }
    const metadata = await response.Body.transformToString();
    return JSON.parse(metadata);
  } catch (error: any) {

    if (error?.name === "NoSuchKey" || error?.$metadata?.httpStatusCode === 404) {
      const emptyMetadata = {};
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: JSON.stringify(emptyMetadata, null, 2),
          ContentType: "application/json",
        })
      );
      return emptyMetadata;
    }
    throw error;
  }
};

export const saveMetadata = async (
  channel: string,
  service: string,
  metadata: object
) => {
  const key = `templates/${channel}/${service}/metadata.json`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(metadata, null, 2),
      ContentType: "application/json",
    })
  );
};