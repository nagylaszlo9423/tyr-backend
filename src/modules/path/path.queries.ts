import {User} from "../user/user.schema";
import {Document, DocumentQuery} from "mongoose";
import {PathSortOptions} from "./path-sort-options";
import {PathVisibility} from "./enums/path-visibility";
import {PathFilter} from "./enums/path-filter";


export class PathQueries {
  constructor() {}

  static queryByFilters(user: User, filters: number[], searchExp: string): any {
    const query: any = {};
    const $or = [];
    filters.forEach(filter => {
      switch (filter) {
        case PathFilter.OWN:
          $or.push({owner: user._id.toString()});
          break;
        case PathFilter.GROUP:
          $or.push({
            group: {$in: user.groups},
            owner: {$ne: user._id.toString()}
          });
          break;
        case PathFilter.PUBLIC:
          $or.push({
            visibility: PathVisibility.PUBLIC,
            owner: {$ne: user._id.toString()}
          });
      }
    });
    if (searchExp) {
      query.$text = {$search: searchExp};
    }
    if ($or.length) {
      query.$or = $or;
    }
    return query;
  }

  static sortByFilters<E extends Document, T = E>(sortBy: string, query: DocumentQuery<T, E>): DocumentQuery<T, E> {
    let sortCondition;
    switch (sortBy) {
      default:
      case PathSortOptions.LAST_CREATED:
        sortCondition = {'audit.createdAt': 1}; break;
      case PathSortOptions.OLDEST_CREATED:
        sortCondition = {'audit.createdAt': -1}; break;
      case PathSortOptions.LAST_MODIFIED:
        sortCondition = {'audit.modifiedAt': 1}; break;
      case PathSortOptions.OLDEST_MODIFIED:
        sortCondition = {'audit.modifiedAt': -1}; break;
      case PathSortOptions.NAME_ASC:
        sortCondition = {'name': 1}; break;
      case PathSortOptions.NAME_DESC:
        sortCondition = {'name': -1}; break;
      case PathSortOptions.VISIBILITY:
        sortCondition = {'visibility': 1}; break;
    }
    return query.collation({ locale: "en" }).sort(sortCondition);
  }
}