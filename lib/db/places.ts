

import { db } from ".";
import { Place, searchPlaces } from "../places/places";
import { placesTable } from "./schema";
import { eq,desc } from "drizzle-orm";



export async function getPlacesByProjectId(projectId: number){
    const p = await db.select().from(placesTable)
        .where(eq(placesTable.projectId, projectId)).orderBy(desc(placesTable.id));

    return p;
}


export async function savePlacesById(projectId: number, places: Array<Place>){

    if(places.length === 0){
        throw new Error("Empty places array, cannot write to DB");
    }

    const rows = places.map((p) => ({
        googlePlacesId: p.id,
        projectId: projectId,
        displayName: p.displayName.text,
        formattedAddress: p.formattedAddress,
        primaryTypeDisplayName: p.primaryTypeDisplayName?.text,
        googleMapsUri: p.googleMapsUri,
        rating: p.rating ?? undefined,
        userRatingCount: p.userRatingCount ?? undefined
    }))

    const res = await db.insert(placesTable).values(rows).onConflictDoNothing().returning({id: placesTable.id})

    return res;
}


async function getExcludedIds(projectId: number){
    const places = await db.select().from(placesTable).where(eq(placesTable.projectId, projectId));

    const result = places.map((p) => String(p.googlePlacesId));

    return new Set(result);

}



export async function searchAndSave(projectId: number, keyword: string, location: string, maxReviews?: number){
    const excludedIds = await getExcludedIds(projectId);

    const places = await searchPlaces(keyword, location, maxReviews ,excludedIds)

    const res = await savePlacesById(projectId, places);



    return res.length;


}