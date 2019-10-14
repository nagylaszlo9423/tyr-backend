import {Callback, createClient, RedisClient, RetryStrategyOptions} from 'redis';
import {Injectable, Logger} from "@nestjs/common";
import * as crypto from 'crypto';
import {TokenBaseSchema} from "../modules/oauth2/schemas/token-base.schema";

export type KeyPrefix = 'access' | 'refresh' | 'code';

@Injectable()
export class RedisService {
  private static readonly Context = 'Redis';
  private redisClient: RedisClient;
  private static readonly retryConnectionIn = 5000;
  private static readonly cipherKey = crypto.randomBytes(16);
  private static readonly initVector = 'initVector';

  constructor(private logger: Logger) {
    this.redisClient = createClient({
      host: '127.0.0.1',
      port: 6379,
      retry_strategy: this.retryStrategy.bind(this)
    });
    this.redisClient.on('connect', () => logger.log('Connected', 'Redis'));
    this.redisClient.on('error', (reason) => logger.error(reason));
  }

  addTokenAndSetExpiration<T extends TokenBaseSchema>(key: string|string[], value: T, prefix: KeyPrefix, expireInSecond?: number): Promise<string> {
    const _key = RedisService.createKey(key, prefix);
    this.logger.debug(`set ${_key}`, RedisService.Context);
    return new Promise<string>((resolve, reject) =>
      this.redisClient.set(_key, RedisService.cipherValue(JSON.stringify(value)), this.handle(reject, () =>
        this.redisClient.expire(_key, expireInSecond, this.handle(reject, () => {
          const expirationDate = new Date();
          expirationDate.setSeconds(expirationDate.getSeconds() + expireInSecond);
          value.expirationDate = expirationDate;
          resolve(_key);
        })))
      ))
  }

  getToken<T extends TokenBaseSchema>(key: string, prefix: KeyPrefix): Promise<T> {
    const _key = RedisService.createKey(key, prefix);
    this.logger.debug(`get ${_key}`, RedisService.Context);
    return new Promise<T>((resolve, reject) =>
      this.redisClient.get(_key, this.handle(reject, (value) => {
        if (value) {
          return resolve(JSON.parse(RedisService.decipherValue(value)));
        }
        return reject();
      })));
  }

  removeToken(key: string|string[], prefix: KeyPrefix): Promise<void> {
    const _key = RedisService.createKey(key, prefix);
    this.logger.debug(`del ${_key}`, RedisService.Context);
    return new Promise<void>((resolve, reject) =>
      this.redisClient.del(_key, (error) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      }));
  }

  private static createKey(key: string|string[], prefix: KeyPrefix): string {
    const _key = typeof key === 'string' ? key : key.reduce((previousValue, currentValue) => previousValue + currentValue);
    return `${prefix}:${RedisService.hashKey(_key)}`;
  }

  private static hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  private static cipherValue(value: string): string {
    return crypto.createCipheriv('aes-128-gcm', RedisService.cipherKey, RedisService.initVector).update(value).toString('hex');
  }

  private static decipherValue(value: string): string {
    const encryptedText = Buffer.from(value, 'hex');
    return crypto.createDecipheriv('aes-128-gcm', RedisService.cipherKey, RedisService.initVector).update(encryptedText).toString();
  }

  private retryStrategy(options: RetryStrategyOptions): number | Error {
    this.logger.error('Connection failed', undefined, 'Redis');
    this.logger.error(options.error);
    this.logger.log(`Retrying to connect in ${RedisService.retryConnectionIn}`, 'Redis');
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
