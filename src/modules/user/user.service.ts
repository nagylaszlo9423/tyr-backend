import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User} from './user.schema';
import {Model} from 'mongoose';
import {GeneralException} from '../../core/errors/exceptions';
import * as crypto from 'crypto';
import {BaseService} from '../../core/services/base.service';
import {RegistrationRequest} from '../../dtos/auth/registration-request';
import {RegistrationResponse} from '../../dtos/auth/registration-response';
import {LoginRequest} from '../../dtos/auth/login-request';
import {AuthCause} from '../../core/errors/cause/auth.cause';
import {ContextService} from '../../core/services/context.service';
import {UserMapper} from './user.mapper';
import {ProfileInfoResponse} from '../../dtos/user/profile-info.response';
import {ModelNames} from '../../db/model-names';
import {RegisterGoogleUserMessage} from './messages/register-google-user.message';
import {ExternalUserInfo} from './external-user-info.schema';
import {RegisterGoogleUserResult} from './messages/register-google-user.result';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectModel(ModelNames.User) userModel: Model<User>,
              @InjectModel(ModelNames.ExternalUserInfo) private externalUserInfoModel: Model<ExternalUserInfo>,
              private ctx: ContextService) {
    super(userModel);
  }

  async register(request: RegistrationRequest): Promise<RegistrationResponse> {
    const existingUser: User = await this.findByEmail(request.email);
    if (existingUser) {
      throw new GeneralException(AuthCause.EMAIL_ALREADY_REGISTERED);
    }
    const newUser: User = new this.model();
    newUser.email = request.email;
    newUser.password = UserService.hashString(request.password);
    await newUser.save();
    return {userId: newUser._id};
  }

  async registerOrLoginGoogleUser(message: RegisterGoogleUserMessage): Promise<RegisterGoogleUserResult> {
    const existingUser: User = await this.findByEmail(message.email);
    if (existingUser) {
      return {userId: existingUser.id};
    }
    const externalUserInfo = new this.externalUserInfoModel();
    externalUserInfo.id = message.externalId;
    const newUser: User = new this.model();
    newUser.email = message.email;
    newUser.externalUserInfo = externalUserInfo;
    await newUser.save();
    return {userId: newUser.id};
  }

  async login(request: LoginRequest): Promise<string> {
    const user = await this.findByEmail(request.email);
    if (!user || user.password !== UserService.hashString(request.password)) {
      throw new GeneralException(AuthCause.LOGIN_DENIED);
    }
    return user._id;
  }

  async findById(id: string): Promise<User> {
    return this._findById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.model.findOne({email}).exec();
  }

  async getProfileInfo(): Promise<ProfileInfoResponse> {
    const user = await this._findById(this.ctx.userId);
    return UserMapper.modelToProfileInfoResponse(user);
  }

  private static hashString(str: string): string {
    return crypto.createHash('sha256').update(str).digest().toString();
  }
}
