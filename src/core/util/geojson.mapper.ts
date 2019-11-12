import {LineString} from "../schemas/line-string.schema";
import {LineStringDto} from "tyr-api";


export class GeojsonMapper {

  static lineStringRequestToModel(request: LineStringDto, model: LineString) {
    model.coordinates = request.coordinates;
  }

  static lineStringModelToResponse(model: LineString): LineStringDto {
    const response = new LineStringDto();

    response.type = model.type;
    response.coordinates = model.coordinates;

    return response;
  }

}
