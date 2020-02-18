import {TokenBaseSchema} from "./token-base.schema";

export class RefreshToken implements TokenBaseSchema {
  userId: string;
  expirationDate: Date;
  value: string;
  accessTokenValue: string;
}
