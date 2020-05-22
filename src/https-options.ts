import {HttpsOptions} from '@nestjs/common/interfaces/external/https-options.interface';
import * as fs from 'file-system';

export const httpsOptions: HttpsOptions = {
  key: fs.readFileSync('./.ssh/private-key.pem'),
  cert: fs.readFileSync('./.ssh/public-certificate.pem')
};
