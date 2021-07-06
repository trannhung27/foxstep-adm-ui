import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity, ICrudGetAllWithCriteriaAction } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IChallenge, defaultValue } from 'app/shared/model/challenge.model';

export const ACTION_TYPES = {
  FETCH_CHALLENGE_LIST: 'challenge/FETCH_CHALLENGE_LIST',
  FETCH_CHALLENGE: 'challenge/FETCH_CHALLENGE',
  CREATE_CHALLENGE: 'challenge/CREATE_CHALLENGE',
  UPDATE_CHALLENGE: 'challenge/UPDATE_CHALLENGE',
  PARTIAL_UPDATE_CHALLENGE: 'challenge/PARTIAL_UPDATE_CHALLENGE',
  DELETE_CHALLENGE: 'challenge/DELETE_CHALLENGE',
  RESET: 'challenge/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IChallenge>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ChallengeState = Readonly<typeof initialState>;

// Reducer

export default (state: ChallengeState = initialState, action): ChallengeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CHALLENGE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CHALLENGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_CHALLENGE):
    case REQUEST(ACTION_TYPES.UPDATE_CHALLENGE):
    case REQUEST(ACTION_TYPES.DELETE_CHALLENGE):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_CHALLENGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CHALLENGE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CHALLENGE):
    case FAILURE(ACTION_TYPES.CREATE_CHALLENGE):
    case FAILURE(ACTION_TYPES.UPDATE_CHALLENGE):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_CHALLENGE):
    case FAILURE(ACTION_TYPES.DELETE_CHALLENGE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CHALLENGE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_CHALLENGE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CHALLENGE):
    case SUCCESS(ACTION_TYPES.UPDATE_CHALLENGE):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_CHALLENGE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CHALLENGE):
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

const apiUrl = 'api/challenges';

// Actions

export const getEntities: ICrudGetAllWithCriteriaAction<IChallenge> = (criteria, page, size, sort) => {
  let criteriaParams = '?';
  Object.keys(criteria).forEach(function (key, index) {
    if (criteria[key]) criteriaParams = criteriaParams + key + '=' + criteria[key] + '&';
  });

  const requestUrl = `${apiUrl}${sort ? `${criteriaParams}page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CHALLENGE_LIST,
    payload: axios.get<IChallenge>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IChallenge> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CHALLENGE,
    payload: axios.get<IChallenge>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IChallenge> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CHALLENGE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IChallenge> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CHALLENGE,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IChallenge> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_CHALLENGE,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IChallenge> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CHALLENGE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
