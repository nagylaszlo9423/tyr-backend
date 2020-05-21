import * as request from 'supertest';

export async function asyncTest<T>(test: request.Test): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    test.end((err, res) => {
      if (err) {
        // tslint:disable-next-line:no-console
        console.error('Error response body:', res?.body);
        return reject(err);
      }
      return resolve(res.body as T);
    });
  });
}
