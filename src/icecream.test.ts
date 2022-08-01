import { test, expect } from "vitest";

import { identity } from "./icecream";

import fc from "fast-check";

fc.configureGlobal({ numRuns: 100, verbose: 2 });

test("identity(x) === x", () => {
  fc.assert(
    fc.property(fc.anything(), (data) => {
      expect(identity(data)).toStrictEqual(data);
    })
  );
});
