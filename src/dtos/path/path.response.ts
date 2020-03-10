import {AuditDto} from '../../core/dto/audit.dto';
import {ResourceItemResponse} from '../../core/dto/resource-item.response';
import {PathVisibility} from '../../modules/path/enums/path-visibility';
import {GeoFeatureDto} from './geo-feature.dto';

export class PathResponse {
    id: string;
    name: string;
    description: string;
    path: GeoFeatureDto;
    audit: AuditDto;
    images: ResourceItemResponse[];
    isEditable: boolean;
    visibility: PathVisibility;
}
