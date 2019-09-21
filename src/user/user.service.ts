import {HttpException, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {IUser, UserSchema} from "./user.schema";
import {Model} from 'mongoose';
import {RegistrationRequest} from "../api/oauth2/registration.request";
import {EmailAlreadyRegistered} from "../api/errors/errors.factory";
import {RegistrationResponse} from "../api/oauth2/registration.response";

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {
  }

  async register(request: RegistrationRequest): Promise<RegistrationResponse> {
    const existingUser: IUser = await this.findByEmail(request.email);
    if (existingUser) {
      throw new EmailAlreadyRegistered();
    }
    const newUser: IUser = new this.userModel();
    newUser.email = request.email;
    newUser.password = request.password;
    await newUser.save();
    return {
      userId: newUser._id
    }
  }

  async findById(id: string): Promise<IUser> {
    return this.userModel.findById(id).exec()
  }

  async findByEmail(email: string): Promise<IUser> {
    return this.userModel.findOne((user: IUser) => user.email === email).exec();
  }
}
