import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity, ICrudGetAllWithCriteriaAction } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { INews, defaultValue } from 'app/shared/model/news.model';

export const ACTION_TYPES = {
  FETCH_FAQS_LIST: 'faqs/FETCH_FAQS_LIST',
  FETCH_FAQS: 'faqs/FETCH_FAQS',
  CREATE_FAQS: 'faqs/CREATE_FAQS',
  UPDATE_FAQS: 'faqs/UPDATE_FAQS',
  PARTIAL_UPDATE_FAQS: 'faqs/PARTIAL_UPDATE_FAQS',
  DELETE_FAQS: 'faqs/DELETE_FAQS',
  RESET: 'faqs/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<INews>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type FaqState = Readonly<typeof initialState>;

// Reducer

export default (state: FaqState = initialState, action): FaqState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_FAQS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_FAQS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_FAQS):
    case REQUEST(ACTION_TYPES.UPDATE_FAQS):
    case REQUEST(ACTION_TYPES.DELETE_FAQS):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_FAQS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_FAQS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_FAQS):
    case FAILURE(ACTION_TYPES.CREATE_FAQS):
    case FAILURE(ACTION_TYPES.UPDATE_FAQS):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_FAQS):
    case FAILURE(ACTION_TYPES.DELETE_FAQS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_FAQS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['xTotalCount'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_FAQS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_FAQS):
    case SUCCESS(ACTION_TYPES.UPDATE_FAQS):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_FAQS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_FAQS):
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

const apiUrl = 'api/faqs';

// Actions

export const getEntities: ICrudGetAllWithCriteriaAction<INews> = (criteria, page, size, sort) => {
  let criteriaParams = '?';
  if (criteria) {
    Object.keys(criteria).forEach(function (key, index) {
      if (criteria[key]) criteriaParams = criteriaParams + key + '=' + criteria[key] + '&';
    });
  }
  const requestUrl = `${apiUrl}${sort ? `${criteriaParams}page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_FAQS_LIST,
    payload: axios.get<INews>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<INews> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_FAQS,
    payload: axios.get<INews>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<INews> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_FAQS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<INews> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_FAQS,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<INews> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_FAQS,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<INews> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_FAQS,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
