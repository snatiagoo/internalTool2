import { describe, expect, it, vi, afterEach } from "vitest";
import { searchPlaces } from "./places";

// Placeholders for the searchPlaces pagination behavior — the same cases we
// worked through manually (small-town/zero-results/65-total/exact-50) when
// debugging the loop condition. To implement: mock the global `fetch`
// (e.g. vi.stubGlobal("fetch", vi.fn())) to return canned
// { places, nextPageToken } bodies per call, instead of hitting the real
// (paid) Google API.

function fakePlace(overrides = {}) {
  return {
    id: "place1",
    displayName: { text: "Test Business", languageCode: "es" },
    formattedAddress: "Calle Falsa 123, Madrid",
    primaryTypeDisplayName: "restaurant",
    googleMapsUri: "https://maps.google.com/?cid=1",
    ...overrides,
  };
}



function fakeResponse(body: object, ok?: boolean, status?: number){
  return { 
    ok: ok ?? true,
     json: async() => body,
    status: status ?? 200} as Response;
}
// fetch returns a Reponse object of shape { ok: boolean, .json(): returns body}

function makeSequentialFetchMock(pages: { count: number; hasNextPage: boolean }[]) {
  let callIndex = 0; // initially 0

  // we start mocking an implementation for this function
  return vi.fn().mockImplementation(async () => {
    const page = pages[callIndex]; // we have a page at 0, 1, 2...
    callIndex++; // increment it to 1, then 2, ... each time fetch is called
    return fakeResponse({ 
      // with fakePlace info 
      places: Array.from({ length: page.count }, (_, i) => // a length is enough
      // to make an array like object to an array
        fakePlace({ id: `place-${callIndex}-${i}` }) 
        // the position in the count and callIndex give name to the place
      ),
      ...(page.hasNextPage ? { nextPageToken: `token-${callIndex}` } : {}), 
      // we generate the nextPageToken so that fetch runs again according to
      // searchPlaces function

      //also the "..." is spreading, ...{} does nothing but ...{a} appends the 
      // properties in {a} to the enclosing object ( fakePlace({}))
    });

  });
}
// function to assign to a count of returned places and hasnextPage boolean
// a call index meaning how many times fetch has to be called for it
// it increases teh call index every time we finish the page count 







describe("searchPlaces", () => {
  afterEach(() => {
    vi.unstubAllGlobals(); // undo the fetch swap so it doesn't leak into the next test
  });





  it(
    "returns all results when a single page covers everything (< 20 results, no pagination needed)",
    async () => {
      const fetchMock = vi.fn()
        .mockResolvedValueOnce(fakeResponse({ places: [fakePlace(), fakePlace({ id: "place2" })] }));
      
        vi.stubGlobal("fetch", fetchMock); //every fetch call now uses fetchMock isntead
      // as we have mocked its resolved value, we will get that instead as resukt

      //then result from searchPlaces will come from mockFetch resolved value, which is a
      //fakeResponse

      const result = await searchPlaces("restaurantes", "Madrid");

      expect(result).toHaveLength(2);
      expect(fetchMock).toHaveBeenCalledTimes(1); 
        // proves it didn't loop for more pages


    }
  );





  it("pages through multiple calls but stops once it has 50 results", async () => {
    
    const fetchMock = makeSequentialFetchMock([
      {count: 20, hasNextPage: true},
      {count: 20, hasNextPage: true},
      {count: 20, hasNextPage: false},
    ]);

    //fetchMock is the fetch inside SearchPlaces.
    // it will only be called once per loop, each with a different set of places on page

    vi.stubGlobal("fetch", fetchMock);

    const result = await searchPlaces("restaurants", "Madrid");
    expect(result).toHaveLength(50);  
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });





  it(
    "stops once Google returns no nextPageToken, even with fewer than 50 results (small-town case) — should NOT restart from page 1",
    async () => {
      const fetchMock = makeSequentialFetchMock([
      {count: 20, hasNextPage: true},
      {count: 10, hasNextPage: false},
    ]);

    vi.stubGlobal("fetch", fetchMock);

    const result = await searchPlaces("restaurants", "Madrid");

    expect(result).toHaveLength(30);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  
    }
  );




  it("does not loop forever when there are 0 results", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(fakeResponse({ places: [] }));

    vi.stubGlobal("fetch", fetchMock);

    const result = await searchPlaces("restaurants", "Madrid");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(0)

  });




  it("trims the final result to exactly 50 when the last page overshoots", async () => {
    
    const fetchMock = makeSequentialFetchMock([
      {count: 20, hasNextPage: true},
      {count: 20, hasNextPage: true},
      {count: 20, hasNextPage: true},
      {count: 20, hasNextPage: true}
    ]);

    vi.stubGlobal("fetch", fetchMock);


    const result = await searchPlaces("restaurantes", "madrid");


    expect(result).toHaveLength(50);
    expect(fetch).toHaveBeenCalledTimes(3);
  });






  it("throws when the Places API responds with a non-ok status", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(fakeResponse({places: []}, false, 400 ));

    vi.stubGlobal("fetch", fetchMock)
    
    await expect(searchPlaces("restaurantes", "Madrid")).rejects.toThrow(); 
      // basically the promise it returns (await searchPlaces) rejects, which is the
      // same for throwing on a synchronous function
      // so we have promise -> result (throws) -> so it is a rejected promise
      // and carries the error as the reason

  });


  it(
    "throws when the response body doesn't match the expected schema (e.g. missing required place fields)",
    async () => {
      const fetchMock = vi.fn()
        .mockResolvedValueOnce(fakeResponse({ places: "not matching the zod schema"}));

      vi.stubGlobal("fetch", fetchMock);

      await expect(searchPlaces("restaurantes", "madrid")).rejects.toThrow();
    }
  );




  it("excludeids filters a place that is already known", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(fakeResponse({places: [fakePlace(), fakePlace({id: "place2"})]}));

    const excludedIds = new Set(["place2"]);

    vi.stubGlobal("fetch", fetchMock);

    const result = await searchPlaces("restaurantes", "madrid", excludedIds);

    expect(result).toHaveLength(1);
  });







  it("when everything on a page is excluded, the loop keeps running until length = 50",
    async () => {
      const fetchMock = makeSequentialFetchMock([
      {count: 20, hasNextPage: true},
      {count: 20, hasNextPage: true},
      {count: 20, hasNextPage: true},
      {count: 20, hasNextPage: true}
    ]);

    const excludedIds = 
    new Set(
      ["place-1-0", "place-1-1", "place-1-2", "place-1-3", "place-1-4",
        "place-1-5", "place-1-6", "place-1-7", "place-1-8", "place-1-9", "place-1-10"]
    );

    vi.stubGlobal("fetch", fetchMock);

    const result = await searchPlaces("restaurantes", "Madrid", excludedIds);

    expect(result).toHaveLength(50);
    expect(fetch).toHaveBeenCalledTimes(4);

    }
  );




  

  it("if all results are excluded, successfully return [] (not rejected)", async () => {
    const fetchMock = makeSequentialFetchMock([
      {count: 10, hasNextPage: false},
    ]);


    const excludedIds = 
    new Set(
      ["place-1-0", "place-1-1", "place-1-2", "place-1-3", "place-1-4",
        "place-1-5", "place-1-6", "place-1-7", "place-1-8", "place-1-9"]
    );


    vi.stubGlobal("fetch", fetchMock);
    const result = await searchPlaces("restaurantes", "Madrid", excludedIds);

    expect(result).toHaveLength(0);

  });





  it("empty excludeIds works fine", async () => {
    const fetchMock = makeSequentialFetchMock([
      {count: 20, hasNextPage: true},
      {count: 10, hasNextPage: false},
    ]);

    const excludedIds = new Set([]);

    vi.stubGlobal("fetch", fetchMock);

    const result = await searchPlaces("restaurantes", "Madrid", excludedIds);

    expect(result).toHaveLength(30);
    
  })
});
