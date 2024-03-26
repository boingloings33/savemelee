// import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

// const client = new S3Client({
//   credentials: {
//     accessKeyId: process.env.AWS_IAM_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
//   },
//   region: "us-east-2",
// });

// export const downloadSavestate = async () => {
//   const command = new GetObjectCommand({

//   });

//   try {
//     const response = await client.send(command);
//     // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
//     const str = await response.Body.transformToString();
//     console.log(str);
//   } catch (err) {
//     console.error(err);
//   }
// };
