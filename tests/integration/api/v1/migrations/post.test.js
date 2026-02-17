import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response1 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response1.status).toBe(403);

        const responseBody = await response1.json();
        expect(responseBody).toEqual({
          name: "ForbiddenError",
          message: "Você não possui permissão para executar esta ação.",
          action:
            'Verifique se o seu usuário possui a feature "create:migration"',
          status_code: 403,
        });
      });

      test("For the second time", async () => {
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response2.status).toBe(403);

        const responseBody = await response2.json();
        expect(responseBody).toEqual({
          name: "ForbiddenError",
          message: "Você não possui permissão para executar esta ação.",
          action:
            'Verifique se o seu usuário possui a feature "create:migration"',
          status_code: 403,
        });
      });
    });
  });
  describe("Default user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const defaultUser = await orchestrator.createUser();
        const activateUser = await orchestrator.activateUser(defaultUser);
        const sessionObject = await orchestrator.createSession(activateUser.id);

        const response1 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",

            headers: {
              Cookie: `session_id=${sessionObject.token}`,
            },
          },
        );
        expect(response1.status).toBe(403);

        const responseBody = await response1.json();
        expect(responseBody).toEqual({
          name: "ForbiddenError",
          message: "Você não possui permissão para executar esta ação.",
          action:
            'Verifique se o seu usuário possui a feature "create:migration"',
          status_code: 403,
        });
      });

      test("For the second time", async () => {
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response2.status).toBe(403);

        const responseBody = await response2.json();
        expect(responseBody).toEqual({
          name: "ForbiddenError",
          message: "Você não possui permissão para executar esta ação.",
          action:
            'Verifique se o seu usuário possui a feature "create:migration"',
          status_code: 403,
        });
      });
    });
  });
  describe("Privileged user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const privilegedUser = await orchestrator.createUser();
        const activateUser = await orchestrator.activateUser(privilegedUser);
        await orchestrator.addFeaturesToUser(privilegedUser, [
          "read:migration",
          "create:migration",
        ]);
        const sessionObject = await orchestrator.createSession(activateUser.id);
        const response1 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
            headers: {
              Cookie: `session_id=${sessionObject.token}`,
            },
          },
        );
        expect(response1.status).toBe(200);

        const response1Body = await response1.json();

        expect(Array.isArray(response1Body)).toBe(true);
      });

      test("For the second time", async () => {
        const privilegedUser = await orchestrator.createUser();
        const activateUser = await orchestrator.activateUser(privilegedUser);
        await orchestrator.addFeaturesToUser(privilegedUser, [
          "read:migration",
          "create:migration",
        ]);
        const sessionObject = await orchestrator.createSession(activateUser.id);
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
            headers: {
              Cookie: `session_id=${sessionObject.token}`,
            },
          },
        );
        expect(response2.status).toBe(200);

        const response2Body = await response2.json();

        expect(Array.isArray(response2Body)).toBe(true);
      });
    });
  });
});
