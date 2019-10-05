import {IsNotEmpty} from "class-validator";


export class RegistrationRequest {

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

}
