import { test, expect } from "vitest";

import { IceCreamV1, IceCreamV2, migrate, rollback } from "./icecream";

import fc from "fast-check";

fc.configureGlobal({ numRuns: 100, verbose: fc.VerbosityLevel.VeryVerbose });

/**
 * Basic unit-test. Tests one case.
 */
test("should migrate and rollback", () => {
  const v1: IceCreamV1 = {
    name: "Twister",
    isCreamy: false,
    keywords: ["the best"],
  };
  const v2: IceCreamV2 = {
    name: "Twister",
    creaminess: 0,
    keywords: ["the best"],
  };

  // Test migration
  const migrated = migrate(v1);
  expect(migrated).toStrictEqual(v2);

  // Test rollback
  const rolledBack = rollback(migrated);
  expect(rolledBack).toStrictEqual(v1);
});

/**
 * IceCreamV1 generator.
 * Creates a random ice-cream of V1.
 */
const arbitraryV1 = fc.record({
  // Create a random string
  name: fc.string(),
  // Either true or false
  isCreamy: fc.boolean(),
  // Some of the following keywords
  keywords: fc.array(
    fc.constantFrom(
      "creamy",
      "mega creamy",
      "icey",
      "super icey",
      "colors",
      "rainbow",
      "quick melter",
      "just for instagram"
    )
  ),
});

/**
 * Property test. For any migration followed
 * by a rollback, we'll get the same value back.
 */
test("rollback(migrate(data)) === data", () => {
  fc.assert(
    fc.property(arbitraryV1, (v1) => {
      skipInvalidV1(v1);

      const migrated = migrate(v1);
      const rolledBack = rollback(migrated);
      expect(rolledBack).toStrictEqual(v1);
    })
  );
});

const skipInvalidV1 = (v1: IceCreamV1) => {
  if (v1.keywords.some((keyword) => keyword.includes("creamy"))) {
    fc.pre(v1.isCreamy);
  }
};
