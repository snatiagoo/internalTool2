

import z from "zod";

 const PlaceSchema = z.object({
    id: z.string(),
    displayName: z.object({
        text: z.string(),
        languageCode: z.string()
    }),
    formattedAddress: z.string(),
    primaryTypeDisplayName: z.string(),
    rating: z.optional(z.number()),
    userRatingCount: z.optional(z.number()),
    googleMapsUri: z.string(),
})

export type Place = z.infer<typeof PlaceSchema>;

const ResponseSchema = z.object({
    places: z.array(PlaceSchema),
    nextPageToken: z.string().optional()
})


export async function searchPlaces(keyword:string, location: string, excludeIds?: Set<string>){
    const results: z.infer<typeof PlaceSchema>[] = [];
    let pageToken: string | undefined = undefined;
    

    do{
        const query = `${keyword} in ${location}`;
        const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
            "X-Goog-FieldMask": 
                "places.id,places.displayName,places.formattedAddress,places.primaryTypeDisplayName,places.rating,places.userRatingCount,places.googleMapsUri",
        },
        body: JSON.stringify({ textQuery: query,
            pageSize: 20,
            ...(pageToken ? { pageToken } : {}) }) // we add to the body we get the pageToken
            // so it would be {"places": [...], "nextPageToken":"..."}
        })

        if(!response.ok){
            throw new Error(`Places API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const places = data.places ?? [];
        const nextPageToken = data.nextPageToken ?? undefined;
        const page = ResponseSchema.parse({places, nextPageToken});
        
         results.push(...page.places.filter((p) => !(excludeIds?.has(p.id))))
        // enough as if exclude ids is undefined everything will 
        pageToken = page.nextPageToken;


    } while(results.length <50 && pageToken);

    return results.slice(0,50);
    

}

