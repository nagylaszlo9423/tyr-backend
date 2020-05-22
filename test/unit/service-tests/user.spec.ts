import {UserService} from '../../../src/modules/user/user.service';
import * as mongoose from 'mongoose';
import {DocumentQuery, Model} from 'mongoose';
import {User, UserSchema} from '../../../src/modules/user/user.schema';
import {Builder} from 'builder-pattern';
import {RegistrationRequest} from '../../../src/dtos/auth/registration-request';
import {UserHelper} from './helper/user.helper';
import {Test, TestingModule} from '@nestjs/testing';
import {getModelToken} from '@nestjs/mongoose';
import {ModelNames} from '../../../src/db/model-names';
import {ExternalUserInfo, ExternalUserInfoSchema} from '../../../src/modules/user/external-user-info.schema';
import {ContextService} from '../../../src/core/services/context.service';
import {LoginRequest} from '../../../src/dtos/auth/login-request';

jest.mock('../../../src/core/services/context.service');

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;
  let userModelMock: Model<User>;
  let externalUserInfoModelMock: Model<ExternalUserInfo>;
  let contextServiceMock: ContextService;

  beforeEach(async () => {
    userModelMock = mongoose.model(ModelNames.User, UserSchema);
    externalUserInfoModelMock = mongoose.model(ModelNames.ExternalUserInfo, ExternalUserInfoSchema);

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        ContextService,
        {provide: getModelToken(ModelNames.User), useValue: userModelMock},
        {provide: getModelToken(ModelNames.ExternalUserInfo), useValue: externalUserInfoModelMock}
      ]
    }).compile();
    module = await moduleRef.init();

    service = module.get<UserService>(UserService);
    contextServiceMock = await module.resolve<ContextService>(ContextService);
  });

  it('should register internal user', async () => {
    const expectedNewUser: User = UserHelper.getNewUser();
    jest.spyOn(userModelMock, 'findOne').mockReturnValue({exec: () => new Promise(resolve => resolve(undefined))} as DocumentQuery<any, any>);
    jest.spyOn(userModelMock.prototype, 'save').mockReturnValue(expectedNewUser);
    const request = Builder<RegistrationRequest>()
      .email('test@mail.hu')
      .password('testpass')
      .build();

    const result = await service.register(request);

    expect(result.userId).toBe(expectedNewUser._id);
  });

  it('should not register when user already exists', async () => {
    const expectedNewUser: User = UserHelper.getNewUser();
    jest.spyOn(userModelMock, 'findOne').mockReturnValue({exec: () => new Promise(resolve => resolve(expectedNewUser))} as DocumentQuery<any, any>);
    jest.spyOn(userModelMock.prototype, 'save').mockReturnValue(expectedNewUser);
    const request = Builder<RegistrationRequest>()
      .email('test@mail.hu')
      .password('testpass')
      .build();

    const result = service.register(request);

    await expect(result).rejects.toThrow();
  });

  it('should login user', async () => {
    const passwordHash = '13d249f2cb4127b40cfa757866850278793f814ded3c587fe5889e889a7a9f6c';
    const expectedUser: User = UserHelper.getNewUser();
    expectedUser.password = passwordHash;
    jest.spyOn(userModelMock, 'findOne').mockReturnValue({exec: () => new Promise(resolve => resolve(expectedUser))} as DocumentQuery<any, any>);

    const request = Builder<LoginRequest>()
      .email('test@mail.hu')
      .password('testpass')
      .clientId('clientId')
      .redirectUri('redirectUri')
      .build();

    const result = await service.login(request);

    expect(result).toBe(expectedUser._id);
  });

  it('should no login user when password missmatching', async () => {
    const passwordHash = 'not_valid_password';
    const expectedUser: User = UserHelper.getNewUser();
    expectedUser.password = passwordHash;
    jest.spyOn(userModelMock, 'findOne').mockReturnValue({exec: () => new Promise(resolve => resolve(expectedUser))} as DocumentQuery<any, any>);

    const request = Builder<LoginRequest>()
      .email('test@mail.hu')
      .password('testpass')
      .clientId('clientId')
      .redirectUri('redirectUri')
      .build();

    const result = service.login(request);

    await expect(result).rejects.toThrow();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

});
