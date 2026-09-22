export class AppError extends Error {
  constructor(message, statusCode = 500, expose = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.expose = expose;
  }
}

export const handleError = (error, response, fallbackMessage = 'Something went wrong.') => {
  const statusCode = error?.statusCode || 500;
  const message = error?.expose ? error.message : fallbackMessage;

  response.status(statusCode).json({
    success: false,
    error: message
  });
};
