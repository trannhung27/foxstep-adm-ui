import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IWfActionType, defaultValue } from 'app/shared/model/workflow/wf-action-type.model';

export const ACTION_TYPES = {
  FETCH_WFACTIONTYPE_LIST: 'wfActionType/FETCH_WFACTIONTYPE_LIST',
  FETCH_WFACTIONTYPE: 'wfActionType/FETCH_WFACTIONTYPE',
  CREATE_WFACTIONTYPE: 'wfActionType/CREATE_WFACTIONTYPE',
  UPDATE_WFACTIONTYPE: 'wfActionType/UPDATE_WFACTIONTYPE',
  PARTIAL_UPDATE_WFACTIONTYPE: 'wfActionType/PARTIAL_UPDATE_WFACTIONTYPE',
  DELETE_WFACTIONTYPE: 'wfActionType/DELETE_WFACTIONTYPE',
  RESET: 'wfActionType/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IWfActionType>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type WfActionTypeState = Readonly<typeof initialState>;

// Reducer

export default (state: WfActionTypeState = initialState, action): WfActionTypeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_WFACTIONTYPE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_WFACTIONTYPE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_WFACTIONTYPE):
    case REQUEST(ACTION_TYPES.UPDATE_WFACTIONTYPE):
    case REQUEST(ACTION_TYPES.DELETE_WFACTIONTYPE):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_WFACTIONTYPE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_WFACTIONTYPE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_WFACTIONTYPE):
    case FAILURE(ACTION_TYPES.CREATE_WFACTIONTYPE):
    case FAILURE(ACTION_TYPES.UPDATE_WFACTIONTYPE):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_WFACTIONTYPE):
    case FAILURE(ACTION_TYPES.DELETE_WFACTIONTYPE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_WFACTIONTYPE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_WFACTIONTYPE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_WFACTIONTYPE):
    case SUCCESS(ACTION_TYPES.UPDATE_WFACTIONTYPE):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_WFACTIONTYPE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_WFACTIONTYPE):
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

const apiUrl = 'api/wf-action-types';

// Actions

export const getEntities: ICrudGetAllAction<IWfActionType> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_WFACTIONTYPE_LIST,
  payload: axios.get<IWfActionType>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IWfActionType> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_WFACTIONTYPE,
    payload: axios.get<IWfActionType>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IWfActionType> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_WFACTIONTYPE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IWfActionType> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_WFACTIONTYPE,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IWfActionType> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_WFACTIONTYPE,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IWfActionType> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_WFACTIONTYPE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
