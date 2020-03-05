import {ArgumentMetadata, Injectable, PipeTransform} from "@nestjs/common";
import {BadRequestException} from "../errors/errors";

@Injectable()
export class ArrayQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (Array.isArray(value)) {
      return value;
    } else if (typeof value === 'string') {
      return [value];
    } else if (value === undefined) {
      return [];
    }

    throw new BadRequestException('Invalid array query parameter');
  }
}
