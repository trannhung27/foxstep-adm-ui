import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IWfProcess, defaultValue } from 'app/shared/model/workflow/wf-process.model';

export const ACTION_TYPES = {
  FETCH_WFPROCESS_LIST: 'wfProcess/FETCH_WFPROCESS_LIST',
  FETCH_WFPROCESS: 'wfProcess/FETCH_WFPROCESS',
  CREATE_WFPROCESS: 'wfProcess/CREATE_WFPROCESS',
  UPDATE_WFPROCESS: 'wfProcess/UPDATE_WFPROCESS',
  PARTIAL_UPDATE_WFPROCESS: 'wfProcess/PARTIAL_UPDATE_WFPROCESS',
  DELETE_WFPROCESS: 'wfProcess/DELETE_WFPROCESS',
  RESET: 'wfProcess/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IWfProcess>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type WfProcessState = Readonly<typeof initialState>;

// Reducer

export default (state: WfProcessState = initialState, action): WfProcessState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_WFPROCESS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_WFPROCESS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_WFPROCESS):
    case REQUEST(ACTION_TYPES.UPDATE_WFPROCESS):
    case REQUEST(ACTION_TYPES.DELETE_WFPROCESS):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_WFPROCESS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_WFPROCESS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_WFPROCESS):
    case FAILURE(ACTION_TYPES.CREATE_WFPROCESS):
    case FAILURE(ACTION_TYPES.UPDATE_WFPROCESS):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_WFPROCESS):
    case FAILURE(ACTION_TYPES.DELETE_WFPROCESS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_WFPROCESS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_WFPROCESS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_WFPROCESS):
    case SUCCESS(ACTION_TYPES.UPDATE_WFPROCESS):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_WFPROCESS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_WFPROCESS):
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

const apiUrl = 'api/wf-processes';

// Actions

export const getEntities: ICrudGetAllAction<IWfProcess> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_WFPROCESS_LIST,
  payload: axios.get<IWfProcess>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IWfProcess> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_WFPROCESS,
    payload: axios.get<IWfProcess>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IWfProcess> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_WFPROCESS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IWfProcess> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_WFPROCESS,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IWfProcess> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_WFPROCESS,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IWfProcess> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_WFPROCESS,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
