import type { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: "eu-north-1",
});

function generateTemporaryPassword(length: number = 12): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialCharacters = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const allCharacters = uppercase + lowercase + numbers + specialCharacters;

  // Assicura che la password contenga almeno un carattere di ciascun tipo richiesto
  const password = [
    uppercase[Math.floor(Math.random() * uppercase.length)],
    lowercase[Math.floor(Math.random() * lowercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)]
  ];

  // Completa la password fino alla lunghezza desiderata
  for (let i = password.length; i < length; i++) {
    password.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
  }

  // Mescola i caratteri per evitare che i primi siano sempre nell'ordine definito sopra
  return password.sort(() => Math.random() - 0.5).join('');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ApiResponse {
  statusCode: number;
  headers: {
    "Access-Control-Allow-Origin": string;
    "Access-Control-Allow-Methods": string;
    "Access-Control-Allow-Headers": string;
  };
  body: string;
}

async function submitNewUser(email: string):Promise<AdminCreateUserCommandOutput | undefined> {
  /* 
  0 => è andato bene
  1 => errore
  */

  console.log("try to add user.");

  try {


    const params = {
      UserPoolId: process.env.AMPLIFY_AUTH_USERPOOL_ID, // Sostituisci con il tuo User Pool ID
      Username: email,
      TemporaryPassword: generateTemporaryPassword(12),
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "email_verified", Value: "true" },
      ],
    };

    console.log("stampo parm", params);

    console.log("---------creo nuovo utente-------");
    const command = new AdminCreateUserCommand(params);
    const response = await client.send(command);

    

    console.log("---------fine creazione nuovo utente-------");


    console.log("risposta:", response);

    return response;



    // creare una
  } catch (error) {
    
    console.log("error POST submitAddUser:", error);

  }


  return undefined;
}

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
) => {
  const path = event.resource;
  const method = event.httpMethod;

  if (path == "/submitAddUser" && method == "POST") {
/* 
    const response:ApiResponse = {
      statusCode:200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
      },
      body: JSON.stringify({message:'null'})
    }; */


    console.log("richiesta di aggiungere un nuovo utente. ");
    console.log("informazioni ricevute:", JSON.stringify(event, null, 2));

    const requestBody = JSON.parse(event.body || "");

    const email = requestBody.email;
    const nomeAzienda = requestBody.azienda;
    const ruolo = requestBody.ruolo;
    //inserire

    console.log("Email:", email);
    console.log("Nome Azienda:", nomeAzienda);
    console.log("Ruolo:", ruolo);

    const result:AdminCreateUserCommandOutput | undefined = await submitNewUser(email);

    console.log("metadata:", result?.$metadata);


    return {

      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
      },
      body: JSON.stringify({ error: "success!" }),
    };
  }

  return {
    statusCode: 405,
    headers: {
      "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
    },
    body: JSON.stringify({ error: "Metodo non consentito" }),
  };
};
