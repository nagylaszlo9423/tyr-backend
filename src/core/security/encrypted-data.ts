
export class EncryptedData {
  public data: string;
  public authTag: string;
  public readonly created: Date;

  constructor(init: {data: string, authTag: string, created?: Date}) {
    this.data = init.data;
    this.authTag = init.authTag;
    this.created = init.created ? new Date(init.created) : new Date();
  }

  static from(jsonString: string): EncryptedData {
    const data = new EncryptedData(JSON.parse(jsonString));

    if (!data.authTag || !data.data) {
      throw new Error('Encrypted data parse failed')
    }

    return data;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
