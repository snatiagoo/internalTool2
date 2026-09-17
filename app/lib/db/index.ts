import { neon } from "@neondatabase/serverless";
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema"
import z from "zod";


const sql = neon(process.env.DATABASE_URL!);


const db = drizzle(sql, {schema});



const dbPlaceSaveSchema = z.object({
    projectId: z.number(),
    googlePlacesId: z.string(),
    displayName: z.string(),
    formattedAddress: z.string(),
    primaryTypeDisplayName: z.string(),
    rating: z.optional(z.number()),
    userRatingCount: z.optional(z.number()),
    googleMapsUri: z.string()
})


const dbPlaceFetchSchema = z.object({
    id: z.number().int(),
    projectId: z.number(),
    googlePlacesId: z.string(),
    displayName: z.string(),
    formattedAddress: z.string(),
    primaryTypeDisplayName: z.string(),
    rating: z.optional(z.number()),
    userRatingCount: z.optional(z.number()),
    googleMapsUri: z.string()
})



