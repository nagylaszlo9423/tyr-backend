import {GeoFeatureDto} from './geo-feature.dto';
import {IsDefined} from 'class-validator';

export class FindPathsInAreaRequest {

  @IsDefined()
  feature: GeoFeatureDto;
}
