import {LineString} from "../schemas/line-string.schema";
import {LineStringDto} from "../../dtos/route/line-string.dto";


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
