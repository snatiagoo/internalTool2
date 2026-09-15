import {
  serial,
  integer,
  pgTable,
  text,
  unique,
} from "drizzle-orm/pg-core";



export const placesTable = pgTable("places",{
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull(),
    googlePlacesId: text("google_places_id").notNull(),
    displayName: text("display_name").notNull(),
    formattedAddress: text("formatted_address").notNull(),
    primaryTypeDisplayName: text("primary_type_display_name").notNull(),
    rating: integer("rating"),
    userRatingCount: integer("rating_count"),
    googleMapsUri: text("google_maps_url").notNull(),
}, (table) =>[
    unique("project_place_unique").on(table.projectId, table.googlePlacesId),
    // applies constraint to those two coluns, saying the combination of both is unique
    // that is, no row can have both as those of another row
    ]
)
