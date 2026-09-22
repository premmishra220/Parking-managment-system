import { handleError } from '../utils/errors.js';

const errorHandler = (error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  const fallbackMessage = 'Unable to process this request.';
  handleError(error, response, fallbackMessage);
};

export default errorHandler;
