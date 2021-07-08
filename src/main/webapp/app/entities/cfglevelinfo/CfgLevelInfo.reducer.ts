import axios from 'axios';
import { 
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction, 
  ICrudGetAllAction, 
  ICrudPutAction, 
  ICrudDeleteAction } 
  from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import {ICfgLevelInfo, defaultValue} from 'app/shared/model/CfgLevelInfo.model';

export const ACTION_TYPES = {
  FETCH_CFGLEVELINFO_LIST: 'cfglevelinfo/FETCH_CFGLEVELINFO_LIST',
  FETCH_CFGLEVELINFO: 'cfglevelinfo/FETCH_CFGLEVELINFO',
  CREATE_CFGLEVELINFO: 'cfglevelinfo/CREATE_CFGLEVELINFO',
  UPDATE_CFGLEVELINFO: 'cfglevelinfo/UPDATE_CFGLEVELINFO',
  PARTIAL_UPDATE_CFGLEVELINFO: 'cfglevelinfo/PARTIAL_UPDATE_CFGLEVELINFO',
  DELETE_CFGLEVELINFO: 'cfglevelinfo/DELETE_CFGLEVELINFO',
  RESET: 'cfglevelinfo/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICfgLevelInfo>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type CfgLevelInfoState = Readonly<typeof initialState>;

// Reducer

export default (state : CfgLevelInfoState = initialState, action) : CfgLevelInfoState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CFGLEVELINFO_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CFGLEVELINFO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_CFGLEVELINFO):
    case REQUEST(ACTION_TYPES.UPDATE_CFGLEVELINFO):
    case REQUEST(ACTION_TYPES.DELETE_CFGLEVELINFO):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_CFGLEVELINFO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CFGLEVELINFO_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CFGLEVELINFO):
    case FAILURE(ACTION_TYPES.CREATE_CFGLEVELINFO):
    case FAILURE(ACTION_TYPES.UPDATE_CFGLEVELINFO):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_CFGLEVELINFO):
    case FAILURE(ACTION_TYPES.DELETE_CFGLEVELINFO):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CFGLEVELINFO_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_CFGLEVELINFO):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CFGLEVELINFO):
    case SUCCESS(ACTION_TYPES.UPDATE_CFGLEVELINFO):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_CFGLEVELINFO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CFGLEVELINFO):
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

const apiUrl = 'api/cfglevelinfos';

// Actions

export const getEntities: ICrudGetAllAction<ICfgLevelInfo> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CFGLEVELINFO_LIST,
    payload: axios.get<ICfgLevelInfo>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ICfgLevelInfo> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CFGLEVELINFO,
    payload: axios.get<ICfgLevelInfo>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ICfgLevelInfo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CFGLEVELINFO,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<ICfgLevelInfo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CFGLEVELINFO,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<ICfgLevelInfo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_CFGLEVELINFO,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICfgLevelInfo> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CFGLEVELINFO,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});


