import { test, expect } from "vitest";

import { IceCreamV1, IceCreamV2, migrate, rollback } from "./icecream";

import fc from "fast-check";

fc.configureGlobal({ numRuns: 100, verbose: fc.VerbosityLevel.VeryVerbose });

const twisterV1: IceCreamV1 = {
  name: "Twister",
  deliciousness: 5,
  isCreamy: false,
  keywords: ["the best"],
};
const twisterV2: IceCreamV2 = {
  name: "Twister",
  deliciousness: 100,
  creaminess: 0,
  keywords: ["the best"],
};

const magnumV1 = {
  name: "Magnum",
  deliciousness: 3,
  isCreamy: true,
  keywords: ["creamy"],
};
const magnumV2 = {
  name: "Magnum",
  deliciousness: 60,
  creaminess: 50,
  keywords: ["creamy"],
};

/**
 * Basic unit-test. Tests one case.
 */
test("should migrate and rollback correctly", () => {
  const icecreamV1 = twisterV1;
  const icecreamV2 = twisterV2;

  const migratedIcecream = migrate(icecreamV1);
  expect(migratedIcecream).toStrictEqual(icecreamV2);

  const rolledbackIceCream = rollback(migratedIcecream);
  expect(rolledbackIceCream).toStrictEqual(icecreamV1);
});

/**
 * Table test. Reuses the same test with different data.
 */
test.each([
  [twisterV1, twisterV2],
  [magnumV1, magnumV2],
])("should migrate and rollback correctly for %o", (icecreamV1, icecreamV2) => {
  const migratedIcecream = migrate(icecreamV1);
  expect(migratedIcecream).toStrictEqual(icecreamV2);

  const rolledbackIceCream = rollback(migratedIcecream);
  expect(rolledbackIceCream).toStrictEqual(icecreamV1);
});

/**
 * Keyword generator. Creates a random keyword from a some options.
 */
const arbitraryKeyword = fc.constantFrom(
  "creamy",
  "mega creamy",
  "icey",
  "super icey",
  "colors",
  "rainbow",
  "quick melter",
  "just for instagram"
);

/**
 * IceCreamV2 generator. Creates a random ice-cream of V2.
 */
const arbitraryIceCreamV2 = fc.record({
  name: fc.string(),
  deliciousness: fc.integer({ min: 1, max: 100 }),
  creaminess: fc.integer({ min: 1, max: 100 }),
  keywords: fc.array(arbitraryKeyword),
});

/**
 * Property test. For any rollback, invalid values will not be produced.
 */
test.skip("rollback(data) does not produce invalid values", () => {
  fc.assert(
    fc.property(arbitraryIceCreamV2, (icecreamV2) => {
      const icecreamV1 = rollback(icecreamV2);
      expect(icecreamV1.deliciousness).to.be.oneOf([1, 2, 3, 4, 5]);
    })
  );
});

/**
 * IceCreamV1 generator. Creates a random ice-cream of V1.
 */
const arbitraryIceCreamV1 = fc.record({
  name: fc.string(),
  deliciousness: fc.oneof(fc.constantFrom(1, 2, 3, 4, 5)),
  isCreamy: fc.boolean(),
  keywords: fc.array(arbitraryKeyword),
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
