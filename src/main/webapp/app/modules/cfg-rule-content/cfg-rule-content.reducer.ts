import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICfgRuleContent, defaultValue } from 'app/shared/model/cfg-rule-content.model';

export const ACTION_TYPES = { 
  FETCH_CFG_RULE_CONTENT_LIST: 'cfg_rule_content/FETCH_CFG_RULE_CONTENT_LIST',
  FETCH_CFG_RULE_CONTENT: 'cfg_rule_content/FETCH_CFG_RULE_CONTENT',
  CREATE_CFG_RULE_CONTENT: 'cfg_rule_content/CREATE_CFG_RULE_CONTENT',
  UPDATE_CFG_RULE_CONTENT: 'cfg_rule_content/UPDATE_CFG_RULE_CONTENT',
  PARTIAL_UPDATE_CFG_RULE_CONTENT: 'cfg_rule_content/PARTIAL_UPDATE_CFG_RULE_CONTENT',
  DELETE_CFG_RULE_CONTENT: 'cfg_rule_content/DELETE_CFG_RULE_CONTENT',
  RESET: 'cfg_rule_content/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICfgRuleContent>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type CfgRuleContentState = Readonly<typeof initialState>;

// Reducer

export default (state: CfgRuleContentState = initialState, action): CfgRuleContentState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CFG_RULE_CONTENT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CFG_RULE_CONTENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_CFG_RULE_CONTENT):
    case REQUEST(ACTION_TYPES.UPDATE_CFG_RULE_CONTENT):
    case REQUEST(ACTION_TYPES.DELETE_CFG_RULE_CONTENT):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_CFG_RULE_CONTENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CFG_RULE_CONTENT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CFG_RULE_CONTENT):
    case FAILURE(ACTION_TYPES.CREATE_CFG_RULE_CONTENT):
    case FAILURE(ACTION_TYPES.UPDATE_CFG_RULE_CONTENT):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_CFG_RULE_CONTENT):
    case FAILURE(ACTION_TYPES.DELETE_CFG_RULE_CONTENT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CFG_RULE_CONTENT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CFG_RULE_CONTENT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CFG_RULE_CONTENT):
    case SUCCESS(ACTION_TYPES.UPDATE_CFG_RULE_CONTENT):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_CFG_RULE_CONTENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CFG_RULE_CONTENT):
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

const apiUrl = 'api/cfg_rule_contents';

// Actions

export const getEntities: ICrudGetAllAction<ICfgRuleContent> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_CFG_RULE_CONTENT_LIST,
  payload: axios.get<ICfgRuleContent>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<ICfgRuleContent> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CFG_RULE_CONTENT,
    payload: axios.get<ICfgRuleContent>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ICfgRuleContent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CFG_RULE_CONTENT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ICfgRuleContent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CFG_RULE_CONTENT,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<ICfgRuleContent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_CFG_RULE_CONTENT,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICfgRuleContent> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CFG_RULE_CONTENT,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
