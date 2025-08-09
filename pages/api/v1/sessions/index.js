import { createRouter } from "next-connect";
import controller from "infra/controller";
import authentication from "models/authentication.js";
import session from "models/session.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;

  const authenticateUser = await authentication.getAuthenticateUser(
    userInputValues.email,
    userInputValues.password,
  );

  const newSession = await session.create(authenticateUser.id);
  await controller.setSessionCookie(newSession.token, response);

  return response.status(201).json(newSession);
}
