import {GroupJoinPolicy} from "./enums/group-join-policy";
import {Document, DocumentQuery} from "mongoose";
import {PathSortOptions} from "../path/path-sort-options";
import {ObjectId} from "../../db/mongoose";
import {GroupFilter} from "./enums/group-filter";


export class GroupQueries {
  constructor() {}

  static queryAllByFilters(userId: string, filters: number[], searchExp: string): any {
    const query: any = {};
    const $or = [];
    filters.forEach(filter => {
      switch (filter) {
        case GroupFilter.MEMBER:
          $or.push({members: {$elemMatch: {$eq: userId}}});
          break;
        case GroupFilter.INVITE_ONLY:
          $or.push({
            joinPolicy: GroupJoinPolicy.INVITE_ONLY,
            members: {$not: {$elemMatch: {$eq: userId}}}
          });
          break;
        case GroupFilter.REQUEST:
          $or.push({
            joinPolicy: GroupJoinPolicy.REQUEST,
            members: {$not: {$elemMatch: {$eq: userId}}}
          });
          break;
        case GroupFilter.OPEN:
          $or.push({
            joinPolicy: GroupJoinPolicy.OPEN,
            members: {$not: {$elemMatch: {$eq: userId}}}
          });
          break;
      }
    });

    if ($or.length) {
      query.$or = $or;
    }

    if (searchExp) {
      query.$text = {$search: searchExp};
    }

    console.log(JSON.stringify(query));
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
