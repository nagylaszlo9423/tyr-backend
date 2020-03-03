import {TestGeoJsons} from "../../test-geo-jsons";
import * as request from "supertest";
import {e2eSuite} from "../e2e-suite";
import {PathRequest} from "../../../src/dtos/path/create-path.request";


e2eSuite('PathController', [
  {
    name: 'should create path',
    test: app => {
      const data = new PathRequest();
      data.title = 'path title';
      data.description = 'description';
      data.path = TestGeoJsons.path;

      request(app.getHttpServer())
        .post('/path')
        .send(data)
        .expect(200);
    }
  }
]);
