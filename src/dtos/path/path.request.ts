import {GeoFeatureDto} from './geo-feature.dto';

export class PathRequest {
    name: string;
    description: string;
    path: GeoFeatureDto;
}
