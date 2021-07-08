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

import {ICfgVo2Rule, defaultValue} from 'app/shared/model/CfgVo2Rule.model';

export const ACTION_TYPES = {
  FETCH_CFGVO2RULE_LIST: 'cfgVo2Rule/FETCH_CFGVO2RULE_LIST',
  FETCH_CFGVO2RULE: 'cfgVo2Rule/FETCH_CFGVO2RULE',
  CREATE_CFGVO2RULE: 'cfgVo2Rule/CREATE_CFGVO2RULE',
  UPDATE_CFGVO2RULE: 'cfgVo2Rule/UPDATE_CFGVO2RULE',
  PARTIAL_UPDATE_CFGVO2RULE: 'cfgVo2Rule/PARTIAL_UPDATE_CFGVO2RULE',
  DELETE_CFGVO2RULE: 'cfgVo2Rule/DELETE_CFGVO2RULE',
  RESET: 'cfgVo2Rule/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICfgVo2Rule>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type CfgVo2RuleState = Readonly<typeof initialState>;

// Reducer

export default (state : CfgVo2RuleState = initialState, action) : CfgVo2RuleState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CFGVO2RULE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CFGVO2RULE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_CFGVO2RULE):
    case REQUEST(ACTION_TYPES.UPDATE_CFGVO2RULE):
    case REQUEST(ACTION_TYPES.DELETE_CFGVO2RULE):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_CFGVO2RULE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CFGVO2RULE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CFGVO2RULE):
    case FAILURE(ACTION_TYPES.CREATE_CFGVO2RULE):
    case FAILURE(ACTION_TYPES.UPDATE_CFGVO2RULE):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_CFGVO2RULE):
    case FAILURE(ACTION_TYPES.DELETE_CFGVO2RULE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CFGVO2RULE_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_CFGVO2RULE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CFGVO2RULE):
    case SUCCESS(ACTION_TYPES.UPDATE_CFGVO2RULE):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_CFGVO2RULE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CFGVO2RULE):
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

const apiUrl = 'api/cfgvo2rules';

// Actions

export const getEntities: ICrudGetAllAction<ICfgVo2Rule> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CFGVO2RULE_LIST,
    payload: axios.get<ICfgVo2Rule>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ICfgVo2Rule> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CFGVO2RULE,
    payload: axios.get<ICfgVo2Rule>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ICfgVo2Rule> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CFGVO2RULE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<ICfgVo2Rule> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CFGVO2RULE,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<ICfgVo2Rule> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_CFGVO2RULE,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICfgVo2Rule> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CFGVO2RULE,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});


