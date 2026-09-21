

import { db } from ".";
import { Place } from "../places/places";
import { placesTable } from "./schema";
import { eq,desc } from "drizzle-orm";



export async function getPlacesByProjectId(projectId: number){
    const p = await db.select().from(placesTable)
        .where(eq(placesTable.projectId, projectId)).orderBy(desc(placesTable.id));

    return p;
}


export async function savePlacesById(projectId: number, places: Array<Place>){
        
    for(const p of places){
        await db.insert(placesTable).values({
            googlePlacesId: p.id,
            projectId: projectId,
            displayName: p.displayName.text,
            formattedAddress: p.formattedAddress,
            primaryTypeDisplayName: p.primaryTypeDisplayName,
            googleMapsUri: p.googleMapsUri,
            rating: p.rating ?? undefined,
            userRatingCount: p.userRatingCount ?? undefined
        })
    }
}