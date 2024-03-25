import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
  credentials: {
    accessKeyId: "AKIASABXFNB5CSWJHK5M",
    secretAccessKey: "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",
  },
  region: "us-east-2",
});

export const downloadSavestate = async () => {
  const command = new GetObjectCommand({
    Bucket: "savemeleegci",
    Key: "sheik-edgeguard-left-1710859104315.gci",
  });

  try {
    const response = await client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response.Body.transformToString();
    console.log(str);
  } catch (err) {
    console.error(err);
  }
};
