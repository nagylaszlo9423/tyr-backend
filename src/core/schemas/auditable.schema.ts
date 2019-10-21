import {IAudit} from "./audit.schema";


export interface IAuditable {
  audit: IAudit
  _userId: string;
}
