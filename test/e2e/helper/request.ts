import * as _request from 'supertest';
import {SuperTest, Test} from 'supertest';

export const request: (app: any) => SuperTest<Test> = _request;
