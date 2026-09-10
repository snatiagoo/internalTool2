

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


export async function searchPlaces(keyword:string, location: string){
    const query = `${keyword} in ${location}`;
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
        "X-Goog-FieldMask": 
            "places.id,places.displayName,places.formattedAddress,places.primaryTypeDisplayName,places.rating,places.userRatingCount,places.googleMapsUri",
    },
    body: JSON.stringify({ textQuery: query })
    })

    if(!response.ok){
        throw new Error(`Places API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return z.array(PlaceSchema).parse(data.places);
    

}

