import {TokenBaseSchema} from "./token-base.schema";

export class AccessToken implements TokenBaseSchema {
  clientId: string;
  userId: string;
  expirationDate: Date;
  value: string;
}
