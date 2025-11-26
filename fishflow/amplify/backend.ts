import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { OnUploadHandler } from "./storage/on-upload-handler/resource";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { myApiFunction } from "./functions/api-function/resource";
import { customCreateAnalisi } from "./data/custom-create-analisi/resource";
const backend = defineBackend({
  auth,
  data,
  storage,
  myApiFunction,
  OnUploadHandler,
  customCreateAnalisi
});

const authPolicy = new Policy(backend.stack, "customBucketUnauthPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:GetObject"],
      resources: [`*`],
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket","s3:GetObject"],
      resources: ["*"],

    }),
  ],
});

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
  authPolicy
);

backend.customCreateAnalisi.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["ecs:RunTask", "ecs:DescribeTasks","iam:PassRole"],
    resources: ["*"],
  })
)

backend.OnUploadHandler.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["dynamodb:ListTables", "dynamodb:PutItem"],
    resources: ["*"],
  })
);
