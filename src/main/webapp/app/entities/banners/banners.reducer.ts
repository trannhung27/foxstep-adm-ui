import axios from 'axios';
import {
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction,
} from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IBanners, defaultValue } from 'app/shared/model/banners.model';

export const ACTION_TYPES = {
  FETCH_BANNERS_LIST: 'banners/FETCH_BANNERS_LIST',
  FETCH_BANNERS: 'banners/FETCH_BANNERS',
  CREATE_BANNERS: 'banners/CREATE_BANNERS',
  UPDATE_BANNERS: 'banners/UPDATE_BANNERS',
  PARTIAL_UPDATE_BANNERS: 'banners/PARTIAL_UPDATE_BANNERS',
  DELETE_BANNERS: 'banners/DELETE_BANNERS',
  RESET: 'banners/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IBanners>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type BannersState = Readonly<typeof initialState>;

// Reducer

export default (state: BannersState = initialState, action): BannersState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_BANNERS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_BANNERS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_BANNERS):
    case REQUEST(ACTION_TYPES.UPDATE_BANNERS):
    case REQUEST(ACTION_TYPES.DELETE_BANNERS):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_BANNERS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_BANNERS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_BANNERS):
    case FAILURE(ACTION_TYPES.CREATE_BANNERS):
    case FAILURE(ACTION_TYPES.UPDATE_BANNERS):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_BANNERS):
    case FAILURE(ACTION_TYPES.DELETE_BANNERS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_BANNERS_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_BANNERS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_BANNERS):
    case SUCCESS(ACTION_TYPES.UPDATE_BANNERS):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_BANNERS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_BANNERS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/banners';

// Actions

export const getEntities: ICrudGetAllAction<IBanners> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_BANNERS_LIST,
    payload: axios.get<IBanners>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IBanners> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_BANNERS,
    payload: axios.get<IBanners>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IBanners> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BANNERS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<IBanners> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_BANNERS,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IBanners> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_BANNERS,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IBanners> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_BANNERS,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
