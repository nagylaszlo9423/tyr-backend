

export class RegistrationRequest {

  email: string;
  password: string;

  constructor(init?: Partial<RegistrationRequest>) {
    init = init || {};
    Object.assign(this, init);
  }
}
