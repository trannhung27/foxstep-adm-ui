import pick from 'lodash/pick';
import { IPaginationBaseState } from 'react-jhipster';
import { IPayload, IPayloadResult } from 'react-jhipster/src/type/redux-action.type';
import { IWfRequest } from 'app/shared/model/workflow/wf-request.model';
import { IWfResponse } from 'app/shared/model/workflow/wf-response.model';
import { IUploadImageResponse } from 'app/shared/model/upload-image/upload-image-response';

/**
 * Removes fields with an 'id' field that equals ''.
 * This function was created to prevent entities to be sent to
 * the server with an empty id and thus resulting in a 500.
 *
 * @param entity Object to clean.
 */
export const cleanEntity = entity => {
  const keysToKeep = Object.keys(entity).filter(k => !(entity[k] instanceof Object) || (entity[k]['id'] !== '' && entity[k]['id'] !== -1));

  return pick(entity, keysToKeep);
};

/**
 * Simply map a list of element to a list a object with the element as id.
 *
 * @param idList Elements to map.
 * @returns The list of objects with mapped ids.
 */
export const mapIdList = (idList: ReadonlyArray<any>) =>
  idList.filter((entityId: any) => entityId !== '').map((entityId: any) => ({ id: entityId }));

export const overridePaginationStateWithQueryParams = (paginationBaseState: IPaginationBaseState, locationSearch: string) => {
  const params = new URLSearchParams(locationSearch);
  const page = params.get('page');
  const sort = params.get('sort');
  if (page && sort) {
    const sortSplit = sort.split(',');
    paginationBaseState.activePage = +page;
    paginationBaseState.sort = sortSplit[0];
    paginationBaseState.order = sortSplit[1];
  }
  return paginationBaseState;
};

export type ICrudGetAllWithCriteriaAction<T> = (
  criteria?: any,
  page?: number,
  size?: number,
  sort?: string
) => IPayload<T> | ((dispatch: any) => IPayload<T>);

export type ICrudPutActionWithCallback<T> = (data?: T, callbackEntity?: any) => IPayload<T> | IPayloadResult<T>;

export type ICrudGetWithParam<T> = (searchValue?: any) => IPayload<T> | ((dispatch: any) => IPayload<T>);

export type ICrudPutActionRequest<IWfRequest> = (
  challengeId?: number,
  entity?: IWfRequest
) => IPayload<IWfResponse> | ((dispatch: any) => IPayload<IWfResponse>);

export type ICrudPutImageRequest<IUploadImageRequest> = (
  entity?: IUploadImageRequest
) => IPayload<IUploadImageResponse> | ((dispatch: any) => IPayload<IUploadImageResponse>);
