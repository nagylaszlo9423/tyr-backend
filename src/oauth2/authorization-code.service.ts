import {Injectable} from "@nestjs/common";
import {IAuthorizationCode} from "./schemas/authorization-code.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import * as crypto from 'crypto'
import {Interval} from "nest-schedule";
import {environment} from "../environment/environment";
import {UserService} from "../user/user.service";


@Injectable()
export class AuthorizationCodeService {

  constructor(@InjectModel('AuthorizationCode') private authorizationCodeModel: Model<IAuthorizationCode>,
              private userService: UserService) {}

  async createAuthorizationCode(userId: string, clientId: string, redirectUri: string): Promise<string> {
    const authorizationCode: IAuthorizationCode = new this.authorizationCodeModel();
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + environment.authorizationCode.expiresInMinutes);
    authorizationCode.code = crypto.randomBytes(environment.authorizationCode.length).toString();
    authorizationCode.userId = userId;
    authorizationCode.clientId = clientId;
    authorizationCode.redirectUri = redirectUri;
    authorizationCode.expirationDate = expirationDate;
    return (await authorizationCode.save()).code;
  }

  async getUserIdForAuthorizationCode(code: string): Promise<string> {
    const authorizationCode = await this.authorizationCodeModel.findOne((authCode: IAuthorizationCode) => authCode.code === code).exec();
    const user = await this.userService.findById(authorizationCode.userId);
    return user.id;
  }

  @Interval(300000)
  deleteExpiredAuthorizationCode() {
    this.authorizationCodeModel.deleteMany((authCode: IAuthorizationCode) => authCode.expirationDate < new Date());
  }
}
