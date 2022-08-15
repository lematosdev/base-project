import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const client = new S3Client({ region: 'us-east-1' });

export default async (base64: string, fileName: string): Promise<String> => {
  const buffer = Buffer.from(base64, 'base64');

  const command = new PutObjectCommand({
    Body: buffer,
    Bucket: process.env.BUCKET_NAME!,
    Key: `images/${fileName}.png`,
    ContentType: 'image/png',
  });

  const url = await getSignedUrl(client, command, {
    expiresIn: 3600,
  });

  return url;
};
