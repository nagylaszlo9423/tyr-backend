import {IsNotEmpty} from "class-validator";


export class RegistrationRequest {

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  constructor(init?: Partial<RegistrationRequest>) {
    init = init || {};
    Object.assign(this, init);
  }
}
