import axios from 'axios';
import { Storage } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { AUTH_API_URL, OAUTH2_URL, OAUTH2_VERIFY, USER_STATUS, AUTH_TOKEN_KEY, AUTH_LOGOUT_URL } from 'app/config/constants';
import { toast } from 'react-toastify';

export const ACTION_TYPES = {
  GET_OAUTH2_URL: 'authentication/GET_OAUTH2_URL',
  VERIFY_OAUTH2_CODE: 'authentication/VERIFY_OAUTH2_CODE',
  LOGIN: 'authentication/LOGIN',
  GET_SESSION: 'authentication/GET_SESSION',
  LOGOUT: 'authentication/LOGOUT',
  CLEAR_AUTH: 'authentication/CLEAR_AUTH',
  ERROR_MESSAGE: 'authentication/ERROR_MESSAGE',
};

const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  account: {} as any,
  errorMessage: (null as unknown) as string, // Errors returned from server side
  redirectMessage: (null as unknown) as string,
  sessionHasBeenFetched: false,
  idToken: (null as unknown) as string,
  logoutUrl: (null as unknown) as string,
  oauth2Url: (null as unknown) as string,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Reducer

export default (state: AuthenticationState = initialState, action): AuthenticationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.LOGIN):
    case REQUEST(ACTION_TYPES.GET_SESSION):
    case REQUEST(ACTION_TYPES.GET_OAUTH2_URL):
    case REQUEST(ACTION_TYPES.VERIFY_OAUTH2_CODE):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.LOGIN):
    case FAILURE(ACTION_TYPES.GET_OAUTH2_URL):
    case FAILURE(ACTION_TYPES.VERIFY_OAUTH2_CODE):
      return {
        ...initialState,
        errorMessage: action.payload,
        loginError: true,
        oauth2Url: state.oauth2Url,
      };
    case FAILURE(ACTION_TYPES.GET_SESSION):
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        sessionHasBeenFetched: true,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.LOGIN):
    case SUCCESS(ACTION_TYPES.VERIFY_OAUTH2_CODE):
      return {
        ...state,
        loading: false,
        loginError: false,
        loginSuccess: true,
      };
    case ACTION_TYPES.LOGOUT:
      return {
        ...initialState,
        oauth2Url: state.oauth2Url,
      };
    case SUCCESS(ACTION_TYPES.GET_SESSION): {
      const isAuthenticated = action.payload && action.payload.data && action.payload.data.status === USER_STATUS.ACTIVATED;
      return {
        ...state,
        isAuthenticated,
        loading: false,
        sessionHasBeenFetched: true,
        account: action.payload.data,
      };
    }
    case SUCCESS(ACTION_TYPES.GET_OAUTH2_URL): {
      return {
        ...state,
        loading: false,
        oauth2Url: action.payload.data.url,
      };
    }
    case ACTION_TYPES.ERROR_MESSAGE:
      return {
        ...initialState,
        redirectMessage: action.message,
        oauth2Url: state.oauth2Url,
      };
    case ACTION_TYPES.CLEAR_AUTH:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export const displayAuthError = message => ({ type: ACTION_TYPES.ERROR_MESSAGE, message });

export const getSession: () => void = () => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.GET_SESSION,
    payload: axios.get('api/account'),
  });
  const isInActive = result.value && result.value.data && result.value.data.status === USER_STATUS.INACTIVE;
  if (isInActive) {
    toast.error('Tài khoản chưa kích hoạt!');
    dispatch(logout());
  }
};

export const getOauth2Url: () => void = () => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.GET_OAUTH2_URL,
    payload: axios.get(OAUTH2_URL),
  });
};

export const verifyOauth2Code: (code: string, rememberMe?: boolean) => void = (code, rememberMe = false) => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.VERIFY_OAUTH2_CODE,
    payload: axios.post(`${OAUTH2_VERIFY}?code=${code}&remember=${rememberMe}`),
  });
  if (!result.value.data.error) {
    const bearerToken = result.value.data.idToken;
    const logoutUrl = result.value.data.logoutUrl;
    if (bearerToken) {
      if (rememberMe) {
        Storage.local.set(AUTH_TOKEN_KEY, bearerToken);
        Storage.local.set(AUTH_LOGOUT_URL, logoutUrl);
      } else {
        Storage.session.set(AUTH_TOKEN_KEY, bearerToken);
        Storage.session.set(AUTH_LOGOUT_URL, logoutUrl);
      }
    }
    await dispatch(getSession());
  }
};

export const login: (username: string, password: string, rememberMe?: boolean) => void = (username, password, rememberMe = false) => async (
  dispatch,
  getState
) => {
  const result = await dispatch({
    type: ACTION_TYPES.LOGIN,
    payload: axios.post(AUTH_API_URL, { username, password, rememberMe }),
  });
  if (!result.value.data.error) {
    const bearerToken = result.value.data.idToken;
    if (bearerToken) {
      if (rememberMe) {
        Storage.local.set(AUTH_TOKEN_KEY, bearerToken);
      } else {
        Storage.session.set(AUTH_TOKEN_KEY, bearerToken);
      }
    }
    await dispatch(getSession());
  }
};

export const clearAuthToken = () => {
  if (Storage.local.get(AUTH_TOKEN_KEY)) {
    Storage.local.remove(AUTH_TOKEN_KEY);
  }
  if (Storage.session.get(AUTH_TOKEN_KEY)) {
    Storage.session.remove(AUTH_TOKEN_KEY);
  }
  if (Storage.local.get(AUTH_LOGOUT_URL)) {
    Storage.local.remove(AUTH_LOGOUT_URL);
  }
  if (Storage.session.get(AUTH_LOGOUT_URL)) {
    Storage.session.remove(AUTH_LOGOUT_URL);
  }
};

export const logout: () => void = () => dispatch => {
  clearAuthToken();
  dispatch({
    type: ACTION_TYPES.LOGOUT,
  });
  if (Storage.local.get(AUTH_LOGOUT_URL)) {
    window.location.replace(Storage.local.get(AUTH_LOGOUT_URL));
  }
  if (Storage.session.get(AUTH_LOGOUT_URL)) {
    window.location.replace(Storage.session.get(AUTH_LOGOUT_URL));
  }
};

export const clearAuthentication = messageKey => (dispatch, getState) => {
  clearAuthToken();
  dispatch(displayAuthError(messageKey));
  dispatch({
    type: ACTION_TYPES.CLEAR_AUTH,
  });
};
