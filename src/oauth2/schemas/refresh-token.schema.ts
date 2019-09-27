import {TokenBaseSchema} from "./token-base.schema";

export class RefreshToken implements TokenBaseSchema {
  accessToken: string;
  userId: string;
  expirationDate: Date;
  value: string;
}
