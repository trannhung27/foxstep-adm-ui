import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction, ICrudSearchAction } from 'react-jhipster';

import { cleanEntity, ICrudGetAllWithCriteriaAction, ICrudGetWithParam } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUsers, defaultValue } from 'app/shared/model/users.model';
import { IChallengesOfUser } from 'app/shared/model/challenges-of-user.model';
import { IWfRequest } from 'app/shared/model/workflow/wf-request.model';
import { getEntities as getActions } from 'app/modules/workflow/wf-action/wf-action-reducer';
import { IUserLockRequest } from 'app/shared/model/user-lock-request.model';

export const ACTION_TYPES = {
  FETCH_USERS_LIST: 'users/FETCH_USERS_LIST',
  FETCH_USERS: 'users/FETCH_USERS',
  CREATE_USERS: 'users/CREATE_CHALLENGE',
  UPDATE_USERS: 'users/UPDATE_CHALLENGE',
  PARTIAL_UPDATE_USERS: 'users/PARTIAL_UPDATE_CHALLENGE',
  FETCH_CHALLENGES_OF_USER_LIST: 'users/FETCH_CHALLENGES_OF_USER_LIST',
  RESET: 'users/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUsers>,
  challengesOfUser: [] as ReadonlyArray<IChallengesOfUser>,
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
    case REQUEST(ACTION_TYPES.FETCH_CHALLENGES_OF_USER_LIST):
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
    case SUCCESS(ACTION_TYPES.CREATE_USERS):
    case SUCCESS(ACTION_TYPES.UPDATE_USERS):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_USERS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case FAILURE(ACTION_TYPES.FETCH_CHALLENGES_OF_USER_LIST):
    case SUCCESS(ACTION_TYPES.FETCH_CHALLENGES_OF_USER_LIST):
      return {
        ...state,
        loading: false,
        challengesOfUser: action.payload.data,
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
const couApiUrl = 'api/challenges-of-user';

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

export const getChallengesOfUser: ICrudGetAllWithCriteriaAction<IChallengesOfUser> = (criteria, page, size, sort) => {
  let criteriaParams = '?';
  if (criteria) {
    Object.keys(criteria).forEach(function (key, index) {
      if (criteria[key]) criteriaParams = criteriaParams + key + '=' + criteria[key] + '&';
    });
  }
  const requestUrl = `${couApiUrl}${sort ? `${criteriaParams}page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CHALLENGES_OF_USER_LIST,
    payload: axios.get<IChallengesOfUser>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getCustomer: ICrudGetWithParam<IUsers> = search => {
  const requestUrl = `${apiUrl}/search?searchValue=${search}`;
  return {
    type: ACTION_TYPES.FETCH_USERS_LIST,
    payload: axios.get<IUsers>(requestUrl),
  };
};

export const getEntity: ICrudGetAction<IUsers> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_USERS,
    payload: axios.get<IUsers>(requestUrl),
  };
};

// need to udpate this method
export const createEntity: ICrudGetAction<IUsers> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_USERS,
    payload: axios.get<IUsers>(requestUrl),
  };
};

// need to udpate this method
export const updateEntity: ICrudGetAction<IUsers> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_USERS,
    payload: axios.get<IUsers>(requestUrl),
  };
};

export const lockUser: ICrudPutAction<IUserLockRequest> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_USERS,
    payload: axios.put(`${apiUrl}/lock/${entity.userId}`, cleanEntity(entity)),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
