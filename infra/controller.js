import * as cookie from "cookie";
import session from "models/session.js";
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

async function setSessionCookie(sessionToken, response) {
  const setCookie = cookie.serialize("session_id", sessionToken, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
  setSessionCookie,
};

export default controller;
