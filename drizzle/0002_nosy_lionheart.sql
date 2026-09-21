ALTER TABLE "places" DROP CONSTRAINT "places_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "places" ADD CONSTRAINT "places_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;