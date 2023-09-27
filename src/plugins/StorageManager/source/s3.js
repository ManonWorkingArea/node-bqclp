import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    forcePathStyle:false,
    endpoint : "https://sgp1.digitaloceanspaces.com",
    region : "ap-southeast-1",
    ResponseContentEncoding:"utf-8",
    credentials: {
      accessKeyId : "DO00DU278JRJU8FXGCLK",
      secretAccessKey : "aOqyyASQ5SMk3faWHCoFE7A42IlHPbIJFHic/W4OF5E"
    }
});

const defaultPrefix = 'SM/';

async function set(key, value, options = {}) {
  const params = {
    Bucket: 'vue-project',
    Key: `${options.prefix || defaultPrefix}${key}`,
    Body: value,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
}

async function get(key, options = {}, retries = 5, delay = 1000) {
    const params = {
      Bucket: 'vue-project',
      Key: `${options.prefix || defaultPrefix}${key}`,
    };
  
    const command = new GetObjectCommand(params);
    let response;
  
    for (let i = 0; i < retries; i++) {
      try {
        response = await s3Client.send(command);
        break;
      } catch (error) {
        if (error.name === 'NoSuchKey' && i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          console.error('Failed to retrieve data from S3:', error);
          throw error;
        }
      }
    }
  
    if (!response) {
      throw new Error('Data not found');
    }
  
    // Use the Response object to convert the ReadableStream to a Blob
    const blob = await new Response(response.Body).blob();
    const text = await blob.text();
  
    return text;
  }

async function deleteObject(key, options = {}) {
  const params = {
    Bucket: 'vue-project',
    Key: `${options.prefix || defaultPrefix}${key}`,
  };

  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);
}

async function destroy(options = {}) {
  const listParams = {
    Bucket: 'vue-project',
    Prefix: options.prefix || defaultPrefix,
  };

  const listCommand = new ListObjectsV2Command(listParams);
  const listedObjects = await s3Client.send(listCommand);

  if (listedObjects.Contents.length === 0) {
    return;
  }

  const deleteParams = {
    Bucket: 'vue-project',
    Delete: {
      Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
    },
  };

  const deleteCommand = new DeleteObjectsCommand(deleteParams);
  await s3Client.send(deleteCommand);

  if (listedObjects.IsTruncated) {
    await destroy(options);
  }
}

const s3Functions = {
  set,
  get,
  delete: deleteObject,
  destroy,
};

export default s3Functions;
