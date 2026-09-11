import { describe, it } from "vitest";

// Placeholders for the searchPlaces pagination behavior — the same cases we
// worked through manually (small-town/zero-results/65-total/exact-50) when
// debugging the loop condition. To implement: mock the global `fetch`
// (e.g. vi.stubGlobal("fetch", vi.fn())) to return canned
// { places, nextPageToken } bodies per call, instead of hitting the real
// (paid) Google API.

describe("searchPlaces", () => {
  it.todo(
    "returns all results when a single page covers everything (< 20 results, no pagination needed)"
  );
  it.todo("pages through multiple calls but stops once it has 50 results");
  it.todo(
    "stops once Google returns no nextPageToken, even with fewer than 50 results (small-town case) — should NOT restart from page 1"
  );
  it.todo("does not loop forever when there are 0 results");
  it.todo("trims the final result to exactly 50 when the last page overshoots");
  it.todo("throws when the Places API responds with a non-ok status");
  it.todo(
    "throws when the response body doesn't match the expected schema (e.g. missing required place fields)"
  );
});
