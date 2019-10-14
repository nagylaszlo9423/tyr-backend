import {TokenBaseSchema} from "./token-base.schema";

export class AuthorizationCode implements TokenBaseSchema {
  clientId: string;
  redirectUri: string;
  userId: string;
  expirationDate: Date;
  value: string;
}
