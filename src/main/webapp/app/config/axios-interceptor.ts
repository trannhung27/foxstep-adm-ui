import axios from 'axios';
import { Storage } from 'react-jhipster';

import { SERVER_API_URL } from 'app/config/constants';
import camelcaseKeys from 'camelcase-keys';
import { logout } from 'app/shared/reducers/authentication';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVER_API_URL;

const setupAxiosInterceptors = onUnauthenticated => {
  const onRequestSuccess = config => {
    const token = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };
  const onResponseSuccess = response => {
    response = camelcaseKeys(response, { deep: true });
    if (response.data.error) return Promise.reject(response);
    return response;
  };
  const onResponseError = err => {
    const status = err.status || (err.response ? err.response.status : 0);
    if (status === 403 || status === 401) {
      // onUnauthenticated();
      logout();
    }
    return Promise.reject(err);
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
