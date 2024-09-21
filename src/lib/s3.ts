
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
 
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function UploadToS3(files: File[]): Promise<string[]> {
  console.log(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID)
  console.log(process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY)
  console.log(process.env.AUTH_SECRET)
  try {
    const uploadPromises = files.map(file => {
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
          Key: `${Date.now()}-${file.name}`,
          Body: file,
          ContentType: file.type,
        },
      });

      return upload.done().then(data => {
        return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${data.Key}`;
      });
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading files to S3:", error);
    throw new Error("Failed to upload files to S3");
  }
}
