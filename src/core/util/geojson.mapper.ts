import {LineString} from '../schemas/line-string.schema';
import {GeoFeatureDto} from '../../dtos/path/geo-feature.dto';

export class GeojsonMapper {

  static lineStringRequestToModel(request: GeoFeatureDto, model: LineString) {
    model.coordinates = request.coordinates;
  }

  static lineStringModelToResponse(model: LineString): GeoFeatureDto {
    const response = new GeoFeatureDto();

    response.type = model.type;
    response.coordinates = model.coordinates;

    return response;
  }

}
