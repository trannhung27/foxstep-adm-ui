import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IWfProcessGroup, defaultValue } from 'app/shared/model/workflow/wf-process-group.model';

export const ACTION_TYPES = {
  FETCH_WFPROCESSGROUP_LIST: 'wfProcessGroup/FETCH_WFPROCESSGROUP_LIST',
  FETCH_WFPROCESSGROUP: 'wfProcessGroup/FETCH_WFPROCESSGROUP',
  CREATE_WFPROCESSGROUP: 'wfProcessGroup/CREATE_WFPROCESSGROUP',
  UPDATE_WFPROCESSGROUP: 'wfProcessGroup/UPDATE_WFPROCESSGROUP',
  PARTIAL_UPDATE_WFPROCESSGROUP: 'wfProcessGroup/PARTIAL_UPDATE_WFPROCESSGROUP',
  DELETE_WFPROCESSGROUP: 'wfProcessGroup/DELETE_WFPROCESSGROUP',
  RESET: 'wfProcessGroup/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IWfProcessGroup>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type WfProcessGroupState = Readonly<typeof initialState>;

// Reducer

export default (state: WfProcessGroupState = initialState, action): WfProcessGroupState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_WFPROCESSGROUP_LIST):
    case REQUEST(ACTION_TYPES.FETCH_WFPROCESSGROUP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_WFPROCESSGROUP):
    case REQUEST(ACTION_TYPES.UPDATE_WFPROCESSGROUP):
    case REQUEST(ACTION_TYPES.DELETE_WFPROCESSGROUP):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_WFPROCESSGROUP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_WFPROCESSGROUP_LIST):
    case FAILURE(ACTION_TYPES.FETCH_WFPROCESSGROUP):
    case FAILURE(ACTION_TYPES.CREATE_WFPROCESSGROUP):
    case FAILURE(ACTION_TYPES.UPDATE_WFPROCESSGROUP):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_WFPROCESSGROUP):
    case FAILURE(ACTION_TYPES.DELETE_WFPROCESSGROUP):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_WFPROCESSGROUP_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_WFPROCESSGROUP):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_WFPROCESSGROUP):
    case SUCCESS(ACTION_TYPES.UPDATE_WFPROCESSGROUP):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_WFPROCESSGROUP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_WFPROCESSGROUP):
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

const apiUrl = 'api/wf-process-groups';

// Actions

export const getEntities: ICrudGetAllAction<IWfProcessGroup> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_WFPROCESSGROUP_LIST,
  payload: axios.get<IWfProcessGroup>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IWfProcessGroup> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_WFPROCESSGROUP,
    payload: axios.get<IWfProcessGroup>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IWfProcessGroup> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_WFPROCESSGROUP,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IWfProcessGroup> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_WFPROCESSGROUP,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IWfProcessGroup> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_WFPROCESSGROUP,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IWfProcessGroup> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_WFPROCESSGROUP,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
