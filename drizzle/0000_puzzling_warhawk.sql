CREATE TABLE "places" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"google_places_id" text NOT NULL,
	"display_name" text NOT NULL,
	"formatted_address" text NOT NULL,
	"primary_type_display_name" text NOT NULL,
	"rating" real,
	"rating_count" integer,
	"google_maps_url" text NOT NULL,
	CONSTRAINT "project_place_unique" UNIQUE("project_id","google_places_id")
);
