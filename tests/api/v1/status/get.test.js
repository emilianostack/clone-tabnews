const database = require("infra/database");

test("Get to /api/v1/status should return 200", async () => {
  const result = await database.query("select 1 + 1");
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
});
