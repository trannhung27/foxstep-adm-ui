import { defaultValue } from 'app/shared/model/challenge.model';
import { IJoinChallengeRequest } from 'app/shared/model/join-challenge/join-challenge-request.model';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { cleanEntity, ICrudGetAllWithCriteriaAction, ICrudPutActionWithCallback } from 'app/shared/util/entity-utils';
import axios from 'axios';
import { ICrudPutAction } from 'react-jhipster';
import { IChallengeUserStatistic } from 'app/shared/model/join-challenge/challenge-user-statistic.model';
import { IWfRequest } from 'app/shared/model/workflow/wf-request.model';

export const ACTION_TYPES = {
  FETCH_CHALLENGE_PARTICIPANTS_LIST: 'cp/FETCH_CHALLENGE_PARTICIPANTS_LIST',
  CREATE_CHALLENGE_PARTICIPANT: 'cp/CREATE_CHALLENGE_PARTICIPANT',
  APPROVE_CHALLENGE_PARTICIPANT: 'cp/APPROVE_CHALLENGE_PARTICIPANT',
  REMOVE_CHALLENGE_PARTICIPANT: 'cp/REMOVE_CHALLENGE_PARTICIPANT',
  RESET: 'cp/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IJoinChallengeRequest>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type JoinChallengeRequestState = Readonly<typeof initialState>;

// Reducer
export default (state: JoinChallengeRequestState = initialState, action): JoinChallengeRequestState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CHALLENGE_PARTICIPANTS_LIST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_CHALLENGE_PARTICIPANT):
    case REQUEST(ACTION_TYPES.APPROVE_CHALLENGE_PARTICIPANT):
    case REQUEST(ACTION_TYPES.REMOVE_CHALLENGE_PARTICIPANT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CHALLENGE_PARTICIPANTS_LIST):
    case FAILURE(ACTION_TYPES.CREATE_CHALLENGE_PARTICIPANT):
    case FAILURE(ACTION_TYPES.APPROVE_CHALLENGE_PARTICIPANT):
    case FAILURE(ACTION_TYPES.REMOVE_CHALLENGE_PARTICIPANT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CHALLENGE_PARTICIPANTS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['xTotalCount'], 10),
      };
    case SUCCESS(ACTION_TYPES.CREATE_CHALLENGE_PARTICIPANT):
    case SUCCESS(ACTION_TYPES.APPROVE_CHALLENGE_PARTICIPANT):
    case SUCCESS(ACTION_TYPES.REMOVE_CHALLENGE_PARTICIPANT):
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

const apiUrl = 'api/challenge-user';

// Actions
export const getEntities: ICrudGetAllWithCriteriaAction<IJoinChallengeRequest> = (criteria, page, size, sort) => {
  let criteriaParams = '?';
  Object.keys(criteria).forEach(function (key, index) {
    if (criteria[key] && key !== 'challengeId') criteriaParams = criteriaParams + key + '=' + criteria[key] + '&';
  });

  const requestUrl = `api/challenges/${criteria.challengeId}/challenge-user/wf-request${criteriaParams}page=${page}&size=${size}`;
  return {
    type: ACTION_TYPES.FETCH_CHALLENGE_PARTICIPANTS_LIST,
    payload: axios.get<IJoinChallengeRequest>(`${requestUrl}&cacheBuster=${new Date().getTime()}`),
  };
};

export const createJoinRequest: ICrudPutAction<IChallengeUserStatistic> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CHALLENGE_PARTICIPANT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities({ challengeId: entity.challenge.id }));
  return result;
};

export const approveJoinRequest: ICrudPutActionWithCallback<IWfRequest> = (entity, callbackEntity) => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.APPROVE_CHALLENGE_PARTICIPANT,
    payload: axios.post(apiUrl + '/approval', cleanEntity(entity)),
  });
  dispatch(getEntities(callbackEntity));
  return result;
};

export const cancelJoinRequest: ICrudPutActionWithCallback<IWfRequest> = (entity, callbackEntity) => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.REMOVE_CHALLENGE_PARTICIPANT,
    payload: axios.post(apiUrl + '/cancel', cleanEntity(entity)),
  });
  dispatch(getEntities(callbackEntity));
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
