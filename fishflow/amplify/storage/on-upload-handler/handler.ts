import type { S3Handler } from "aws-lambda";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../data/resource";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend-function/runtime";
import { Amplify } from "aws-amplify";
import { env } from "$amplify/env/on-upload-handler";

// Configurazione iniziale (assicurarsi che il modulo supporti il top-level await)

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const clientSchema = generateClient<Schema>();

export const handler: S3Handler = async (event, context) => {
  console.log("Context:", JSON.stringify(context, null, 2));
  console.log("Event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const url = record.s3.object.key;
    const size = record.s3.object.size;

    console.log(`Upload handler invoked for object [${url}] with size ${size} bytes`);

    const urlSplit = url.split('/');
    console.log("Split URL:", urlSplit);

    const userId = urlSplit[3];
    const nameFile = urlSplit[4];

    const data = await clientSchema.models.Video.create({
      name: nameFile,
      path: url,
      collaboratoreId: userId,
      size: size, // Assumendo che il modello Video abbia il campo 'size'
    });
    console.log("Created Video record:", data);
  }
};