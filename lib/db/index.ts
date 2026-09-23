import { neon } from "@neondatabase/serverless";
import { drizzle } from 'drizzle-orm/neon-http';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { placesTable, projects } from "./schema";
import * as schema from "./schema"
import z from "zod";


const sql = neon(process.env.DATABASE_URL!);


export const db = drizzle(sql, {schema});


// drizzle-zod package
// const insertPlaceSchema = createInsertSchema(placesTable);

export const dbPlaceSaveSchema = z.object({
    projectId: z.number().int(),
    googlePlacesId: z.string(),
    displayName: z.string(),
    formattedAddress: z.string(),
    primaryTypeDisplayName: z.string(),
    rating: z.number().nullable(),
    userRatingCount: z.number().nullable(),
    googleMapsUri: z.string()
})

//const selectPlaceSchema = createSelectSchema(placesTable);

export const dbPlaceFetchSchema = z.object({
    id: z.number().int(),
    projectId: z.number().int(),
    googlePlacesId: z.string(),
    displayName: z.string(),
    formattedAddress: z.string(),
    primaryTypeDisplayName: z.string(),
    rating: z.number().nullable(),
    userRatingCount: z.number().nullable(),
    googleMapsUri: z.string()
})




// and if we wanted to update any row (maybe necessary in the future):
export const updatePlaceSchema = createUpdateSchema(placesTable);
// shoudl use these functions form the package in case
// I ever update the tables (remove/add columns), as they are synced
// so no need to manually mdoify the defined schemas above



// Same zod Schema pattern for projects table schemas
export const insertProjectSchema = createInsertSchema(projects);

export const selectProjectSchema = createSelectSchema(projects);

export const updateProjectSchema = createUpdateSchema(projects);






