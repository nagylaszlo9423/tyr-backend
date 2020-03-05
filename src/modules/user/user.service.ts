import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User} from "./user.schema";
import {Model} from 'mongoose';
import {GeneralException} from "../../core/errors/errors";
import * as crypto from 'crypto';
import {BaseService} from "../../core/services/base.service";
import {RegistrationRequest} from "../../dtos/auth/registration-request";
import {RegistrationResponse} from "../../dtos/auth/registration-response";
import {LoginRequest} from "../../dtos/auth/login-request";

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectModel('User') userModel: Model<User>) {
    super(userModel);
  }

  async register(request: RegistrationRequest): Promise<RegistrationResponse> {
    const existingUser: User = await this.findByEmail(request.email);
    if (existingUser) {
      throw new GeneralException("EMAIL_ALREADY_REGISTERED");
    }
    const newUser: User = new this.model();
    newUser.email = request.email;
    newUser.password = UserService.hashString(request.password);
    await newUser.save();
    return {
      userId: newUser._id
    }
  }

  async login(request: LoginRequest): Promise<string> {
    const user = await this.findByEmail(request.email);
    if (!user || user.password !== UserService.hashString(request.password)) {
      throw new GeneralException("LOGIN_DENIED");
    }
    return user._id;
  }

  async findById(id: string): Promise<User> {
    return this._findById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.model.findOne({email: email}).exec();
  }

  private static hashString(str: string): string {
    return  crypto.createHash('sha256').update(str).digest().toString();
  }
}
