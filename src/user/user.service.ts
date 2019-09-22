import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {IUser} from "./user.schema";
import {Model} from 'mongoose';
import {RegistrationRequest} from "../api/oauth2/registration.request";
import {EmailAlreadyRegisteredException, LoginDeniedException} from "../api/errors/errors";
import {RegistrationResponse} from "../api/oauth2/registration.response";
import * as crypto from 'crypto';
import {LoginRequest} from "../api/oauth2/login.request";

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {
  }

  async register(request: RegistrationRequest): Promise<RegistrationResponse> {
    const existingUser: IUser = await this.findByEmail(request.email);
    if (existingUser) {
      throw new EmailAlreadyRegisteredException();
    }
    const newUser: IUser = new this.userModel();
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
      throw new LoginDeniedException();
    }
    return user._id;
  }

  async findById(id: string): Promise<IUser> {
    return this.userModel.findById(id).exec()
  }

  async findByEmail(email: string): Promise<IUser> {
    return this.userModel.findOne({email: email}).exec();
  }

  private static hashString(str: string): string {
    return  crypto.createHash('sha256').update(str).digest().toString();
  }
}
