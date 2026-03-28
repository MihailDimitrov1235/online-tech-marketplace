import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectVersionsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY,
  },
});

export const signFiles = async (keys) => {
  return Promise.all(
    keys.map((key) =>
      getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.B2_BUCKET_NAME,
          Key: key,
        }),
        { expiresIn: 3600 },
      ),
    ),
  );
};

export const signProduct = async (product) => ({
  ...product,
  images: await signFiles(product.images),
});

export const signProducts = async (products) => {
  return Promise.all(products.map(signProduct));
};

export const uploadFiles = async (files, folder = "products") => {
  return Promise.all(
    files.map(async (file) => {
      const key = `${folder}/${randomUUID()}-${file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.B2_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return key;
    }),
  );
};

export const deleteFiles = async (keys) => {
  if (!keys.length) return;

  await Promise.all(
    keys.map(async (key) => {
      // get all versions of the file
      const { Versions = [], DeleteMarkers = [] } = await s3.send(
        new ListObjectVersionsCommand({
          Bucket: process.env.B2_BUCKET_NAME,
          Prefix: key,
        }),
      );

      // delete every version and delete marker
      const toDelete = [...Versions, ...DeleteMarkers];
      await Promise.all(
        toDelete.map((v) =>
          s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.B2_BUCKET_NAME,
              Key: v.Key,
              VersionId: v.VersionId,
            }),
          ),
        ),
      );
    }),
  );
};
