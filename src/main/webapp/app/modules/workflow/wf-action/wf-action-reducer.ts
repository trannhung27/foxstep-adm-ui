import { IWfActionType } from 'app/shared/model/workflow/wf-action-type.model';
import { IWfAction } from 'app/shared/model/workflow/wf-action.model';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import axios from 'axios';
import { ICrudGetAllWithCriteriaAction } from 'app/shared/util/entity-utils';

export const ACTION_TYPES = {
  FETCH_WFACTION_LIST: 'wfAction/FETCH_WFACTION_LIST',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IWfAction>,
};

export type WfActionState = Readonly<typeof initialState>;

// Reducer
export default (state: WfActionState = initialState, action): WfActionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_WFACTION_LIST):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_WFACTION_LIST):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_WFACTION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/wf/actions';

// Actions
export const getEntities: ICrudGetAllWithCriteriaAction<IWfAction> = (criteria, page, size, sort) => {
  let criteriaParams = '?';
  if (criteria) {
    Object.keys(criteria).forEach(function (key, index) {
      if (criteria[key]) criteriaParams = criteriaParams + key + '=' + criteria[key] + '&';
    });
  }
  return {
    type: ACTION_TYPES.FETCH_WFACTION_LIST,
    payload: axios.get<IWfAction>(`${apiUrl}${criteriaParams}?cacheBuster=${new Date().getTime()}`),
  };
};
