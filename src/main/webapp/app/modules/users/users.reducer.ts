import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity, ICrudGetAllWithCriteriaAction } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUsers, defaultValue } from 'app/shared/model/users.model';

export const ACTION_TYPES = {
  FETCH_USERS_LIST: 'users/FETCH_USERS_LIST',
  FETCH_USERS: 'users/FETCH_USERS',
  RESET: 'users/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUsers>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type UsersState = Readonly<typeof initialState>;

// Reducer

export default (state: UsersState = initialState, action): UsersState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_USERS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_USERS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_USERS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_USERS):
    case SUCCESS(ACTION_TYPES.FETCH_USERS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['xTotalCount'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_USERS):
      return {
        ...state,
        loading: false,
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

const apiUrl = 'api/app/users';

// Actions

export const getEntities: ICrudGetAllWithCriteriaAction<IUsers> = (criteria, page, size, sort) => {
  let criteriaParams = '?';
  if (criteria) {
    Object.keys(criteria).forEach(function (key, index) {
      if (criteria[key]) criteriaParams = criteriaParams + key + '=' + criteria[key] + '&';
    });
  }
  const requestUrl = `${apiUrl}${sort ? `${criteriaParams}page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_USERS_LIST,
    payload: axios.get<IUsers>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IUsers> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_USERS,
    payload: axios.get<IUsers>(requestUrl),
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
