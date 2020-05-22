import {User} from '../../../../src/modules/user/user.schema';
import {ExternalUserInfo} from '../../../../src/modules/user/external-user-info.schema';

export class UserHelper {
  static index = 0;

  static getNewUser(): User {
    this.index++;
    return {
      _id: `id${this.index}`,
      email: `test${this.index}@mail.hu`,
      password: `testpass${this.index}`,
      friends: [],
      groups: [],
      paths: [],
      picture: 'https://localhost/picture.jpg',
      role: undefined,
      externalUserInfo: {
        externalId: `externalId${this.index}`
      } as ExternalUserInfo
    } as User;
  }

}
