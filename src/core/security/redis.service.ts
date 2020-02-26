import {Callback, createClient, RedisClient, RetryStrategyOptions} from 'redis';
import {Injectable, Logger} from "@nestjs/common";
import * as crypto from 'crypto';
import {TokenBaseSchema} from "../../modules/oauth2/schemas/token-base.schema";
import {EncryptedData} from "./encrypted-data";
import {UnauthorizedException} from "../../errors/errors";
import {environment} from "../../environment/environment";

export type KeyPrefix = 'access' | 'refresh' | 'code';

@Injectable()
export class RedisService {
  private static readonly Context = 'Redis';
  private static readonly retryConnectionIn = 5000;
  private static readonly hashAlgorithm = 'sha256';
  private static readonly cipherAlgorithm = 'aes-128-gcm';
  private static readonly cipherKey = Buffer.from(environment.security.encryption.cipherKey, 'hex') || crypto.randomBytes(16);
  private static readonly initVector = Buffer.from(environment.security.encryption.initVector, 'hex') || crypto.randomBytes(16);
  private created: Date;
  private redisClient: RedisClient;

  constructor(private logger: Logger) {
    this.redisClient = createClient({
      host: '127.0.0.1',
      port: 6379,
      retry_strategy: this.retryStrategy.bind(this)
    });
    this.redisClient.on('connect', () => logger.log('Connected', RedisService.Context));
    this.redisClient.on('error', (reason) => logger.error(reason));
    this.created = new Date();
  }

  addTokenAndSetExpiration<T extends TokenBaseSchema>(key: string|string[], value: T, prefix: KeyPrefix, expireInSecond?: number): Promise<string> {
    const _key = this.createKey(key, prefix);
    this.logger.debug(`set ${_key}`, RedisService.Context);
    return new Promise<string>((resolve, reject) =>
      this.redisClient.set(_key, this.cipherValue(JSON.stringify(value)).toString(), this.handle(reject, () =>
        this.redisClient.expire(_key, expireInSecond, this.handle(reject, () => {
          const expirationDate = new Date();
          expirationDate.setSeconds(expirationDate.getSeconds() + expireInSecond);
          value.expirationDate = expirationDate;
          resolve(_key);
        })))
      ))
  }

  getToken<T extends TokenBaseSchema>(key: string, prefix: KeyPrefix): Promise<T> {
    const _key = this.createKey(key, prefix);
    this.logger.debug(`get ${_key}`, RedisService.Context);
    return new Promise<T>((resolve, reject) =>
      this.redisClient.get(_key, this.handle(reject, (value) => {
        try {
          if (value) {
            return resolve(JSON.parse(this.decipherValue(EncryptedData.from(value))));
          }
          return reject();
        } catch (e) {
          reject(e);
        }
      })));
  }

  removeToken(key: string|string[], prefix: KeyPrefix): Promise<void> {
    const _key = this.createKey(key, prefix);
    this.logger.debug(`del ${_key}`, RedisService.Context);
    return new Promise<void>((resolve, reject) =>
      this.redisClient.del(_key, (error) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      }));
  }

  private createKey(key: string|string[], prefix: KeyPrefix): string {
    const _key = typeof key === 'string' ? key : key.reduce((previousValue, currentValue) => previousValue + currentValue);
    return `${prefix}:${this.hashKey(_key)}`;
  }

  private hashKey(key: string): string {
    return crypto.createHash(RedisService.hashAlgorithm).update(key).digest('hex');
  }

  private cipherValue(value: string): EncryptedData {
    const cipher = crypto.createCipheriv(RedisService.cipherAlgorithm, Buffer.from(RedisService.cipherKey), RedisService.initVector);
    let encrypted = cipher.update(value, 'utf8');
    cipher.final();
    return new EncryptedData({
      data: encrypted.toString('hex'),
      authTag: cipher.getAuthTag().toString('hex')
    });
  }

  private decipherValue(value: EncryptedData): string {
    if (!this.isEncryptedDataValid(value)) {
      throw new UnauthorizedException();
    }
    const authTag = Buffer.from(value.authTag, 'hex');
    const decipher = crypto.createDecipheriv(RedisService.cipherAlgorithm, Buffer.from(RedisService.cipherKey), RedisService.initVector);
    decipher.setAuthTag(authTag);
    const encryptedValue = Buffer.from(value.data, 'hex');
    let deciphered = decipher.update(encryptedValue);
    decipher.final();
    return deciphered.toString();
  }

  private isEncryptedDataValid(value: EncryptedData) {
    console.log(value.created, this.created)
    return value.created > this.created;
  }

  private retryStrategy(options: RetryStrategyOptions): number | Error {
    this.logger.error('Connection failed', undefined, RedisService.Context);
    this.logger.error(options.error);
    this.logger.log(`Retrying to connect in ${RedisService.retryConnectionIn}`, RedisService.Context);
    return RedisService.retryConnectionIn;
  }

  private handle<T>(reject: (reason: any) => any, onSuccess: (result: T) => void): Callback<T> {
    return ((err, reply) => {
      if (err) {
        return reject(err);
      }
      return onSuccess(reply);
    })
  }
}
