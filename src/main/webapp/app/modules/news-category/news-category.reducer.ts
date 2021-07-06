import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { INewsCategory, defaultValue } from 'app/shared/model/news-category.model';

export const ACTION_TYPES = {
  FETCH_NEWSCATEGORY_LIST: 'newsCategory/FETCH_NEWSCATEGORY_LIST',
  FETCH_NEWSCATEGORY: 'newsCategory/FETCH_NEWSCATEGORY',
  CREATE_NEWSCATEGORY: 'newsCategory/CREATE_NEWSCATEGORY',
  UPDATE_NEWSCATEGORY: 'newsCategory/UPDATE_NEWSCATEGORY',
  PARTIAL_UPDATE_NEWSCATEGORY: 'newsCategory/PARTIAL_UPDATE_NEWSCATEGORY',
  DELETE_NEWSCATEGORY: 'newsCategory/DELETE_NEWSCATEGORY',
  RESET: 'newsCategory/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<INewsCategory>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type NewsCategoryState = Readonly<typeof initialState>;

// Reducer

export default (state: NewsCategoryState = initialState, action): NewsCategoryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_NEWSCATEGORY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_NEWSCATEGORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_NEWSCATEGORY):
    case REQUEST(ACTION_TYPES.UPDATE_NEWSCATEGORY):
    case REQUEST(ACTION_TYPES.DELETE_NEWSCATEGORY):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_NEWSCATEGORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_NEWSCATEGORY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_NEWSCATEGORY):
    case FAILURE(ACTION_TYPES.CREATE_NEWSCATEGORY):
    case FAILURE(ACTION_TYPES.UPDATE_NEWSCATEGORY):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_NEWSCATEGORY):
    case FAILURE(ACTION_TYPES.DELETE_NEWSCATEGORY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_NEWSCATEGORY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_NEWSCATEGORY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_NEWSCATEGORY):
    case SUCCESS(ACTION_TYPES.UPDATE_NEWSCATEGORY):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_NEWSCATEGORY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_NEWSCATEGORY):
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

const apiUrl = 'api/news-categories';

// Actions

export const getEntities: ICrudGetAllAction<INewsCategory> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_NEWSCATEGORY_LIST,
    payload: axios.get<INewsCategory>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<INewsCategory> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_NEWSCATEGORY,
    payload: axios.get<INewsCategory>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<INewsCategory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_NEWSCATEGORY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<INewsCategory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_NEWSCATEGORY,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<INewsCategory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_NEWSCATEGORY,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<INewsCategory> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_NEWSCATEGORY,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
