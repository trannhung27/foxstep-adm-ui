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

import { INewsCategories, defaultValue } from 'app/shared/model/news_categories.model';

export const ACTION_TYPES = {
  FETCH_NEWS_CATEGOR_LIST: 'news_categories/FETCH_NEWS_CATEGORIES_LIST',
  FETCH_NEWS_CATEGORY: 'news_categories/FETCH_NEWS_CATEGORIES',
  CREATE_NEWS_CATEGORY: 'news_categories/CREATE_NEWS_CATEGORIES',
  UPDATE_NEWS_CATEGORIES: 'news_categories/UPDATE_NEWS_CATEGORIES',
  PARTIAL_UPDATE_NEWS_CATEGORIES: 'news_categories/PARTIAL_UPDATE_NEWS_CATEGORIES',
  DELETE_NEWS_CATEGORIES: 'news_categories/DELETE_NEWS_CATEGORIES',
  RESET: 'news_categories/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<INewsCategories>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type News_categoriesState = Readonly<typeof initialState>;

// Reducer

export default (state: News_categoriesState = initialState, action): News_categoriesState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_NEWS_CATEGOR_LIST):
    case REQUEST(ACTION_TYPES.FETCH_NEWS_CATEGORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_NEWS_CATEGORY):
    case REQUEST(ACTION_TYPES.UPDATE_NEWS_CATEGORIES):
    case REQUEST(ACTION_TYPES.DELETE_NEWS_CATEGORIES):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_NEWS_CATEGORIES):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_NEWS_CATEGOR_LIST):
    case FAILURE(ACTION_TYPES.FETCH_NEWS_CATEGORY):
    case FAILURE(ACTION_TYPES.CREATE_NEWS_CATEGORY):
    case FAILURE(ACTION_TYPES.UPDATE_NEWS_CATEGORIES):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_NEWS_CATEGORIES):
    case FAILURE(ACTION_TYPES.DELETE_NEWS_CATEGORIES):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_NEWS_CATEGOR_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_NEWS_CATEGORY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_NEWS_CATEGORY):
    case SUCCESS(ACTION_TYPES.UPDATE_NEWS_CATEGORIES):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_NEWS_CATEGORIES):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_NEWS_CATEGORIES):
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


const apiUrl = 'api/news_categories';

// Actions

export const getEntities: ICrudGetAllAction<INewsCategories> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_NEWS_CATEGOR_LIST,
    payload: axios.get<INewsCategories>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<INewsCategories> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_NEWS_CATEGORY,
    payload: axios.get<INewsCategories>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<INewsCategories> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_NEWS_CATEGORY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<INewsCategories> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_NEWS_CATEGORIES,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<INewsCategories> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_NEWS_CATEGORIES,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<INewsCategories> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_NEWS_CATEGORIES,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
