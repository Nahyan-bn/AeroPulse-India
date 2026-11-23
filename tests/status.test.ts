import assert from "node:assert/strict";
import test from "node:test";
import { envStatus } from "../src/lib/status";

test("environment status distinguishes missing configuration", () => {
  assert.equal(envStatus("DATABASE_URL", false, ""), "NOT CONFIGURED");
});

test("environment status identifies test credentials", () => {
  assert.equal(envStatus("DUFFEL_ACCESS_TOKEN", true, "test credentials"), "TEST MODE");
});

test("environment status identifies approval gates", () => {
  assert.equal(envStatus("OPENSKY_PERMISSION", true, "awaiting approval"), "PENDING APPROVAL");
});
