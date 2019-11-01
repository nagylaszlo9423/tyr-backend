import {FeatureType} from "../../core/feature-type.enum";
import {ObjectInitializer} from "../../core/util/object-initializer";


export class LineStringDto extends ObjectInitializer<LineStringDto>{
  type: FeatureType.LINE_STRING;
  coordinates: number[][];
}
