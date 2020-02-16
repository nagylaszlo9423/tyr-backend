import {ObjectInitializer} from "../util/object-initializer";


export class EncryptedData extends ObjectInitializer<EncryptedData> {
  public data: string;
  public authTag: string;

  static from(jsonString: string): EncryptedData {
    const data = JSON.parse(jsonString) as EncryptedData;

    if (!data.authTag || !data.data) {
      throw new Error('Encrypted data parse failed')
    }

    return data;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
