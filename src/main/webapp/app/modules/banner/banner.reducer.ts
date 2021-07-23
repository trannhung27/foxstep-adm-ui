import axios from 'axios';
import { ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';

import { cleanEntity, ICrudGetAllWithCriteriaAction } from 'app/shared/util/entity-utils';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

import { defaultValue, IBanner } from 'app/shared/model/banner.model';

export const ACTION_TYPES = {
  FETCH_BANNER_LIST: 'banner/FETCH_BANNER_LIST',
  FETCH_SEARCH_BANNER_LIST: 'banner/FETCH_SEARCH_BANNER_LIST',
  CREATE_BANNER: 'banner/CREATE_BANNER',
  RESET: 'banner/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IBanner>,
  searchList: [] as ReadonlyArray<IBanner>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  totalItems: 0,
};

export type BannerState = Readonly<typeof initialState>;

// Reducer

export default (state: BannerState = initialState, action): BannerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_BANNER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SEARCH_BANNER_LIST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_BANNER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_BANNER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SEARCH_BANNER_LIST):
    case FAILURE(ACTION_TYPES.CREATE_BANNER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_BANNER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_SEARCH_BANNER_LIST):
      return {
        ...state,
        loading: false,
        searchList: action.payload.data,
        totalItems: parseInt(action.payload.headers['xTotalCount'], 10),
      };
    case SUCCESS(ACTION_TYPES.CREATE_BANNER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
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

export const getEntities: ICrudGetAllAction<IBanner> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_BANNER_LIST,
  payload: axios.get<IBanner>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const searchBanners: ICrudGetAllWithCriteriaAction<IBanner> = (criteria, page, size, sort) => {
  let criteriaParams = '?';
  Object.keys(criteria).forEach(function (key, index) {
    if (criteria[key]) criteriaParams = criteriaParams + key + '=' + criteria[key] + '&';
  });

  const requestUrl = `${apiUrl}/search${
    sort ? `${criteriaParams}page=${page}&size=${size}&sort=dateStart,desc&sort=dateFinish,desc&sort=datePublished,desc` : ''
  }`;
  return {
    type: ACTION_TYPES.FETCH_SEARCH_BANNER_LIST,
    payload: axios.get<IBanner>(`${requestUrl}`),
  };
};

export const createEntity: ICrudPutAction<IBanner> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BANNER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
