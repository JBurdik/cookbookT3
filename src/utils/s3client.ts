// Create service client module using ES6 syntax.
import { S3Client } from "@aws-sdk/client-s3";
// Set the AWS Region.
// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  region: process.env.S3_UPLOAD_REGION as string,
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_KEY as string,
    secretAccessKey: process.env.S3_UPLOAD_SECRET as string,
  },
});
export { s3Client };
