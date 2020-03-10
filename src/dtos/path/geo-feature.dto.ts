import {IsDefined, IsIn} from 'class-validator';
import {FeatureType} from '../../core/feature-type.enum';

export class GeoFeatureDto {
    @IsIn(Object.values(FeatureType))
    type: string;

    @IsDefined()
    coordinates: number[][];
}
