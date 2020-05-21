import {ArgumentMetadata, Injectable, ParseIntPipe, PipeTransform} from '@nestjs/common';
import {BadRequestException} from '../errors/exceptions';

@Injectable()
export class ParseIntArrayPipe implements PipeTransform {
  constructor(private parseIntPipe: ParseIntPipe) {}

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (Array.isArray(value)) {
      return await Promise.all(value.map(val => this.parseIntPipe.transform(val, metadata)));
    } else if (typeof value === 'string') {
      return [await this.parseIntPipe.transform(value, metadata)];
    } else if (value === undefined) {
      return [];
    }

    throw new BadRequestException('Invalid array query parameter');
  }
}
