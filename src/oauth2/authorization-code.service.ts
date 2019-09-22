import {Injectable, Logger} from "@nestjs/common";
import {IAuthorizationCode} from "./schemas/authorization-code.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import * as crypto from 'crypto'
import {Interval, NestSchedule} from "nest-schedule";
import {environment} from "../environment/environment";
import {UserService} from "../user/user.service";


@Injectable()
export class AuthorizationCodeService extends NestSchedule {

  constructor(@InjectModel('AuthorizationCode') private authorizationCodeModel: Model<IAuthorizationCode>,
              private userService: UserService,
              private logger: Logger) {
    super();
  }

  async createAuthorizationCode(userId: string, clientId: string, redirectUri: string): Promise<string> {
    const authorizationCode: IAuthorizationCode = new this.authorizationCodeModel();
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + environment.authorizationCode.expiresInMinutes);
    authorizationCode.code = crypto.randomBytes(environment.authorizationCode.length).toString('hex');
    authorizationCode.userId = userId;
    authorizationCode.clientId = clientId;
    authorizationCode.redirectUri = redirectUri;
    authorizationCode.expirationDate = expirationDate;
    return (await authorizationCode.save()).code;
  }

  async getUserIdForAuthorizationCode(code: string, clientId: string, redirectUri: string): Promise<string> {
    const authorizationCode = await this.authorizationCodeModel.findOne({code: code, clientId: clientId, redirectUri: redirectUri}).exec();
    const user = await this.userService.findById(authorizationCode.userId);
    return user.id;
  }

  @Interval(environment.authorizationCode.autoCleanInMillis)
  async deleteExpiredAuthorizationCode() {
    this.logger.log('Deleting expired refresh tokens...');
    await this.authorizationCodeModel.deleteMany({expirationDate: {$lt: new Date()}}).exec();
    this.logger.log('Deleted expired refresh tokens')
  }
}
