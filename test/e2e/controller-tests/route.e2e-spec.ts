import {TestGeoJsons} from "../../test-geo-jsons";
import * as request from "supertest";
import {e2eSuite} from "../e2e-suite";
import {CreateRouteRequest} from "tyr-api";


e2eSuite('RouteController', [
  {
    name: 'should create route',
    test: app => {
      const data = new CreateRouteRequest();
      data.title = 'route title';
      data.description = 'description';
      data.path = TestGeoJsons.path;

      request(app.getHttpServer())
        .post('/route')
        .send(data)
        .expect(200);
    }
  }
]);
