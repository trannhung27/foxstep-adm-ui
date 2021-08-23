import { isPromise } from 'react-jhipster';

const getErrorMessage = errorData => {
  let message = errorData.error;
  if (errorData.fieldErrors) {
    errorData.fieldErrors.forEach(fErr => {
      message += `\nfield: ${fErr.field},  Object: ${fErr.objectName}, message: ${fErr.message}\n`;
    });
  }
  return message;
};

export default () => next => action => {
  // If not a promise, continue on
  if (!isPromise(action.payload)) {
    return next(action);
  }

  /**
   *
   * The error middleware serves to dispatch the initial pending promise to
   * the promise middleware, but adds a `catch`.
   * It need not run in production
   */
  if (process.env.NODE_ENV === 'development') {
    // Dispatch initial pending promise, but catch any errors
    return next(action).catch(error => {
      if (error.message || error.data.error)
        console.error(`${action.type} caught at middleware with reason: ${JSON.stringify(error.message || error.data.error)}.`);
      if (error && error.response && error.response.data) console.error(`Actual cause: ${getErrorMessage(error.response.data)}`);

      return Promise.reject(error);
    });
  }
  return next(action);
};
