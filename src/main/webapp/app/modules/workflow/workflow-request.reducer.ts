import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { defaultValue, IWfRequest } from 'app/shared/model/workflow/wf-request.model';
import { ICrudPutAction } from 'react-jhipster';
import axios from 'axios';
import { cleanEntity } from 'app/shared/util/entity-utils';

export const ACTION_TYPES = {
  CREATE_WORKFLOW_REQUEST: 'wf/CREATE_WORKFLOWREQUEST',
  UPDATE_WORKFLOW_REQUEST: 'wf/UPDATE_WORKFLOWREQUEST',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type WfRequestState = Readonly<typeof initialState>;

// Reducer
export default (state: WfRequestState = initialState, action): WfRequestState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.CREATE_WORKFLOW_REQUEST):
    case REQUEST(ACTION_TYPES.UPDATE_WORKFLOW_REQUEST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.CREATE_WORKFLOW_REQUEST):
    case FAILURE(ACTION_TYPES.UPDATE_WORKFLOW_REQUEST):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.CREATE_WORKFLOW_REQUEST):
    case SUCCESS(ACTION_TYPES.UPDATE_WORKFLOW_REQUEST):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/wf';

//Actions

export const create: ICrudPutAction<IWfRequest> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_WORKFLOW_REQUEST,
    payload: axios.post(apiUrl + '/create', cleanEntity(entity)),
  });
  return result;
};

export const update: ICrudPutAction<IWfRequest> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_WORKFLOW_REQUEST,
    payload: axios.post(apiUrl + '/update', cleanEntity(entity)),
  });
  return result;
};
