import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
} from "./errors";

function onNoMatchHandler(request, response) {
  const publicObjectError = new MethodNotAllowedError();
  return response.status(publicObjectError.statusCode).json(publicObjectError);
}

function onErrorHandler(error, request, response) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError
  ) {
    return response.status(error.statusCode).json(error);
  }
  const publicObjectError = new InternalServerError({
    cause: error,
  });
  response.status(publicObjectError.statusCode).json(publicObjectError);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
