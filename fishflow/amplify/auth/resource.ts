import { defineAuth } from '@aws-amplify/backend';
import { myApiFunction } from '../functions/api-function/resource';
import { OnUploadHandler } from '../storage/on-upload-handler/resource';
import { createUser } from '../data/create-user/resource';
/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },

  groups: ["ADMIN","ADMIN_AZIENDA","USERS"],

    

  access: (allow) => [
    allow.resource(myApiFunction).to(["createUser"]),
    allow.resource(createUser).to(["createUser"]),
    allow.resource(OnUploadHandler).to(['getUser']),
  ],
});
