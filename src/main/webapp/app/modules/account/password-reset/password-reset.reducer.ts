import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  RESET_PASSWORD_INIT: 'passwordReset/RESET_PASSWORD_INIT',
  RESET_PASSWORD_FINISH: 'passwordReset/RESET_PASSWORD_FINISH',
  RESET: 'passwordReset/RESET',
};

const initialState = {
  loading: false,
  resetPasswordSuccess: false,
  resetPasswordFailure: false,
};

export type PasswordResetState = Readonly<typeof initialState>;

// Reducer
export default (state: PasswordResetState = initialState, action): PasswordResetState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.RESET_PASSWORD_FINISH):
    case REQUEST(ACTION_TYPES.RESET_PASSWORD_INIT):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.RESET_PASSWORD_FINISH):
    case FAILURE(ACTION_TYPES.RESET_PASSWORD_INIT):
      return {
        ...initialState,
        loading: false,
        resetPasswordFailure: true,
      };
    case SUCCESS(ACTION_TYPES.RESET_PASSWORD_FINISH):
    case SUCCESS(ACTION_TYPES.RESET_PASSWORD_INIT):
      return {
        ...initialState,
        loading: false,
        resetPasswordSuccess: true,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/account/reset-password';

// Actions
export const handlePasswordResetInit = mail => ({
  type: ACTION_TYPES.RESET_PASSWORD_INIT,
  // If the content-type isn't set that way, axios will try to encode the body and thus modify the data sent to the server.
  payload: axios.post(`${apiUrl}/init`, mail, { headers: { ['Content-Type']: 'text/plain' } }),
  meta: {
    successMessage: 'Đã gửi mail reset mật khẩu!',
  },
});

export const handlePasswordResetFinish = (key, newPassword) => ({
  type: ACTION_TYPES.RESET_PASSWORD_FINISH,
  payload: axios.post(`${apiUrl}/finish`, { key, newPassword }),
  meta: {
    successMessage: 'Cập nhật mật khẩu thành công!',
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
