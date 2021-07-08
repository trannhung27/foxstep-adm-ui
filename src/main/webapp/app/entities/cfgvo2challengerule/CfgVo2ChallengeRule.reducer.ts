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

import {ICfgVo2ChallengeRule, defaultValue} from 'app/shared/model/CfgVo2ChallengeRule.model';

export const ACTION_TYPES = {
  FETCH_CFGVO2CHALLENGERULE_LIST: 'cfgVo2ChallengeRule/FETCH_CFGVO2CHALLENGERULE_LIST',
  FETCH_CFGVO2CHALLENGERULE: 'cfgVo2ChallengeRule/FETCH_CFGVO2CHALLENGERULE',
  CREATE_CFGVO2CHALLENGERULE: 'cfgVo2ChallengeRule/CREATE_CFGVO2CHALLENGERULE',
  UPDATE_CFGVO2CHALLENGERULE: 'cfgVo2ChallengeRule/UPDATE_CFGVO2CHALLENGERULE',
  PARTIAL_UPDATE_CFGVO2CHALLENGERULE: 'cfgVo2ChallengeRule/PARTIAL_UPDATE_CFGVO2CHALLENGERULE',
  DELETE_CFGVO2CHALLENGERULE: 'cfgVo2ChallengeRule/DELETE_CFGVO2CHALLENGERULE',
  RESET: 'cfgVo2ChallengeRule/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICfgVo2ChallengeRule>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type CfgVo2ChallengeRuleState = Readonly<typeof initialState>;

// Reducer

export default (state : CfgVo2ChallengeRuleState = initialState, action) : CfgVo2ChallengeRuleState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CFGVO2CHALLENGERULE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CFGVO2CHALLENGERULE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_CFGVO2CHALLENGERULE):
    case REQUEST(ACTION_TYPES.UPDATE_CFGVO2CHALLENGERULE):
    case REQUEST(ACTION_TYPES.DELETE_CFGVO2CHALLENGERULE):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_CFGVO2CHALLENGERULE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CFGVO2CHALLENGERULE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CFGVO2CHALLENGERULE):
    case FAILURE(ACTION_TYPES.CREATE_CFGVO2CHALLENGERULE):
    case FAILURE(ACTION_TYPES.UPDATE_CFGVO2CHALLENGERULE):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_CFGVO2CHALLENGERULE):
    case FAILURE(ACTION_TYPES.DELETE_CFGVO2CHALLENGERULE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CFGVO2CHALLENGERULE_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_CFGVO2CHALLENGERULE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CFGVO2CHALLENGERULE):
    case SUCCESS(ACTION_TYPES.UPDATE_CFGVO2CHALLENGERULE):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_CFGVO2CHALLENGERULE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CFGVO2CHALLENGERULE):
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

const apiUrl = 'api/cfgvo2challengerules';

// Actions

export const getEntities: ICrudGetAllAction<ICfgVo2ChallengeRule> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CFGVO2CHALLENGERULE_LIST,
    payload: axios.get<ICfgVo2ChallengeRule>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ICfgVo2ChallengeRule> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CFGVO2CHALLENGERULE,
    payload: axios.get<ICfgVo2ChallengeRule>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ICfgVo2ChallengeRule> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CFGVO2CHALLENGERULE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<ICfgVo2ChallengeRule> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CFGVO2CHALLENGERULE,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<ICfgVo2ChallengeRule> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_CFGVO2CHALLENGERULE,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICfgVo2ChallengeRule> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CFGVO2CHALLENGERULE,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});


