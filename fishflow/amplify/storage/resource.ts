import { defineStorage } from "@aws-amplify/backend";
import { OnUploadHandler } from "./on-upload-handler/resource";
import { OnDeleteHandler } from "./on-delete-handler/resource";
export const storage = defineStorage({
    name:'fishFlowStorage',

    triggers: {
        
        onUpload: OnUploadHandler,
        onDelete: OnDeleteHandler,

    },
    access: (allow)=>({

        'media/videos/{entity_id}/*':[
            allow.groups(['ADMIN','USERS']).to(['read','delete','write']),
            allow.entity('identity').to(['read', 'write', 'delete'])
        ],
        'analyses/{entity_id}/*':[
            allow.groups(['ADMIN']).to(['read','delete','write']),
            allow.groups(['USERS']).to(['read','delete','write']),
            allow.entity('identity').to(['read', 'write', 'delete'])
            
        ]
        
    })
})



