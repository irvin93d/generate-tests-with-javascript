import { test, expect } from "vitest";

import { IceCreamV1, IceCreamV2, migrate, rollback } from "./icecream";

import fc from "fast-check";

fc.configureGlobal({ numRuns: 100, verbose: fc.VerbosityLevel.VeryVerbose });

/**
 * Basic unit-test. Tests one case.
 */
test("should migrate and rollback correctly", () => {
  const icecreamV1: IceCreamV1 = {
    name: "Twister",
    isCreamy: false,
    keywords: ["the best"],
  };
  const icecreamV2: IceCreamV2 = {
    name: "Twister",
    creaminess: 0,
    keywords: ["the best"],
  };

  // Test migration
  const migratedIcecream = migrate(icecreamV1);
  expect(migratedIcecream).toStrictEqual(icecreamV2);

  // Test rollback
  const rolledbackIceCream = rollback(migratedIcecream);
  expect(rolledbackIceCream).toStrictEqual(icecreamV1);
});

/**
 * IceCreamV1 generator. Creates a random ice-cream of V1.
 */
const arbitraryIceCreamV1 = fc.record({
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
 * Property test. For any migration followed by a rollback,
 * we'll get the same value back.
 */
test.skip("rollback(migrate(data)) === data", () => {
  fc.assert(
    fc.property(arbitraryIceCreamV1, (icecream) => {
      if (icecream.keywords.some((keyword) => keyword.includes("creamy"))) {
        fc.pre(icecream.isCreamy);
      }
      expect(rollback(migrate(icecream))).toStrictEqual(icecream);
    })
  );
});
