CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_name" text NOT NULL,
	"icp" text
);
--> statement-breakpoint
ALTER TABLE "places" ADD CONSTRAINT "places_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;