import {LineStringDto} from "../../api/geojson/line-string.dto";
import {LineString} from "../schemas/line-string.schema";


export class GeojsonMapper {

  static lineStringRequestToModel(request: LineStringDto, model: LineString) {
    model.coordinates = request.coordinates;
  }

  static lineStringModelToResponse(model: LineString): LineStringDto {
    return new LineStringDto({
      type: model.type,
      coordinates: model.coordinates
    });
  }

}
